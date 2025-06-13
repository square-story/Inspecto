import Stripe from "stripe";
import appConfig from "../config/app.config";
import { IPaymentDocument, PaymentStatus } from "../models/payment.model";
import mongoose, { ObjectId, Types } from "mongoose";
import { InspectionStatus } from "../models/inspection.model";
import { BaseService } from "../core/abstracts/base.service";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { ServiceError } from "../core/errors/service.error";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { TransactionStatus, TransactionType, WalletOwnerType } from "../models/wallet.model";
import { INotificationService } from "../core/interfaces/services/notification.service.interface";
import { NotificationType } from "../models/notification.model";
import { IInspector } from "../models/inspector.model";
import { IUsers } from "../models/user.model";
import { IInspectionTypeRepository } from "../core/interfaces/repositories/inspection-type.repository.interface";

export const stripe = new Stripe(appConfig.stripSecret, {
    apiVersion: '2025-01-27.acacia'
});

@injectable()
export class PaymentService extends BaseService<IPaymentDocument> implements IPaymentService {
    private readonly PENDING_TIMEOUT_MS = 15 * 60 * 1000;
    private readonly CANCEL_WINDOW_MS = 10 * 60 * 1000;
    constructor(
        @inject(TYPES.PaymentRepository) private _paymentRepository: IPaymentRepository,
        @inject(TYPES.InspectionRepository) private _inspectionRepository: IInspectionRepository,
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.InspectionService) private _inspectionService: IInspectionService,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService,
        @inject(TYPES.InspectionTypeRepository) private _inspectionTypeRepository: IInspectionTypeRepository,
    ) {
        super(_paymentRepository);
    }

    private async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            return await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            console.error(`Error retrieving payment intent ${paymentIntentId}:`, error);
            throw new Error('Failed to retrieve payment intent');
        }
    }

    private async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
        try {
            await stripe.paymentIntents.cancel(paymentIntentId);
            await this._paymentRepository.updatePayment(paymentIntentId, { status: PaymentStatus.FAILED });
        } catch (error) {
            console.error(`Error canceling payment intent ${paymentIntentId}:`, error);
            throw new ServiceError('Failed to cancel payment intent');
        }
    }

    async createPaymentIntent(inspectionId: string, userId: string, amount: number, isRetry = false, paymentIntentId?: string): Promise<Stripe.PaymentIntent> {
        const existingPayments = await this._paymentRepository.findPendingByInspection(inspectionId);

        let reusableIntent: Stripe.PaymentIntent | null = null;

        for (const payment of existingPayments) {
            try {
                const intent = await this.retrievePaymentIntent(payment.stripePaymentIntentId);

                if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(intent.status)) {
                    reusableIntent = intent;
                    break;
                } else {
                    await this.cancelPaymentIntent(payment.stripePaymentIntentId);
                }
            } catch (error) {
                console.error(`Error processing payment ${payment.stripePaymentIntentId}:`, error);
                await this._paymentRepository.updatePayment(payment.stripePaymentIntentId, { status: PaymentStatus.FAILED });
            }
        }

        if (reusableIntent) {
            return reusableIntent;
        }

        if (isRetry && paymentIntentId) {
            try {
                const existingIntent = await this.retrievePaymentIntent(paymentIntentId);
                if (existingIntent.status === 'succeeded') {
                    const existingPayment = await this._paymentRepository.getPaymentByIntentId(paymentIntentId);
                    if (existingPayment?.status === PaymentStatus.SUCCEEDED) {
                        return existingIntent;
                    }
                }
                if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existingIntent.status)) {
                    return existingIntent;
                } else {
                    throw new Error('Payment intent is not in a returnable state');
                }
            } catch (error) {
                console.error(`Error retrieving payment intent ${paymentIntentId}:`, error);
                throw new Error('Failed to retrieve payment intent for retry');
            }
        }

        const newPaymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            metadata: { inspectionId, userId },
            payment_method_types: ['card']
        });

        await this._paymentRepository.create({
            inspection: new Types.ObjectId(inspectionId),
            user: new Types.ObjectId(userId),
            amount,
            currency: 'inr',
            stripePaymentIntentId: newPaymentIntent.id,
            status: PaymentStatus.PENDING
        });

        return newPaymentIntent;
    }

    async handleWebhookEvent(event: Stripe.Event): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let payment;

            switch (event.type) {
                case "payment_intent.succeeded": {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    payment = await this._paymentRepository.updatePayment(paymentIntent.id, { status: PaymentStatus.SUCCEEDED });

                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this._inspectionRepository.update(payment.inspection, { status: InspectionStatus.CONFIRMED });
                    break;
                }

                case "payment_intent.payment_failed": {
                    const failedPayment = event.data.object as Stripe.PaymentIntent;
                    payment = await this._paymentRepository.updatePayment(failedPayment.id, { status: PaymentStatus.FAILED });

                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this._inspectionRepository.update(payment.inspection, { status: InspectionStatus.CANCELLED });
                    await this._inspectionService.cancelInspection(payment.inspection.toString());
                    break;
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error('Error handling webhook:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    async verifyPayment(paymentIntentId: string) {
        try {
            return await this._paymentRepository.getPaymentByIntentId(paymentIntentId);
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    async findPayments(userId: string) {
        try {
            return await this._paymentRepository.findUserPayments(userId);
        } catch (error) {
            console.error('Error getting payments data:', error);
            throw error;
        }
    }

    async handleStaleTransactions(): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const staleDate = new Date(Date.now() - this.PENDING_TIMEOUT_MS);
            const stalePayments = await this._paymentRepository.findStalePayments(PaymentStatus.PENDING, staleDate);

            for (const payment of stalePayments) {
                try {
                    const paymentIntent = await this.retrievePaymentIntent(payment.stripePaymentIntentId);

                    if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(paymentIntent.status)) {
                        await this.cancelPaymentIntent(payment.stripePaymentIntentId);
                    }

                    await this._paymentRepository.updatePayment(payment.stripePaymentIntentId, { status: PaymentStatus.FAILED });
                    await this._inspectionRepository.update(payment.inspection, { status: InspectionStatus.CANCELLED });
                    await this._inspectionService.cancelInspection(payment.inspection.toString());
                } catch (error) {
                    console.error(`Error handling stale payment ${payment.stripePaymentIntentId}:`, error);
                    continue;
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error('Error handling stale transactions:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }
    async processInspectionPayment(inspectionId: string) {
        try {
            const inspection = await this._inspectionRepository.findById(
                new Types.ObjectId(inspectionId),
                ['inspector', 'user', 'inspectionType']
            );

            if (!inspection) throw new ServiceError('Inspection not found');
            if (inspection.status !== InspectionStatus.CONFIRMED) {
                throw new ServiceError('Inspection is not confirmed');
            }

            const payment = await this._paymentRepository.findOne({
                inspection: inspectionId,
                status: PaymentStatus.SUCCEEDED
            })

            if (!payment) {
                throw new ServiceError('Inspection payment is not found')
            }

            const inspectionType = await this._inspectionTypeRepository.findById(
                inspection.inspectionType as unknown as Types.ObjectId
            );

            if (!inspectionType) {
                throw new ServiceError('Inspection type not found');
            }

            const platformFee = inspectionType.platformFee;
            const totalAmount = inspectionType.price + platformFee;
            const inspectorAmount = totalAmount - platformFee;

            let inspectorWallet = await this._walletRepository.findOne({
                owner: inspection.inspector,
                ownerType: WalletOwnerType.INSPECTOR
            })

            if (!inspectorWallet) {
                inspectorWallet = await this._walletRepository.create({
                    owner: inspection.inspector,
                    ownerType: WalletOwnerType.INSPECTOR,
                    balance: 0,
                    pendingBalance: 0,
                    transactions: []
                });
            }

            let adminWallet = await this._walletRepository.findOne({
                ownerType: WalletOwnerType.ADMIN
            })

            if (!adminWallet) {
                adminWallet = await this._walletRepository.create({
                    owner: new mongoose.Types.ObjectId() as unknown as ObjectId,
                    ownerType: WalletOwnerType.ADMIN,
                    balance: 0,
                    pendingBalance: 0,
                    transactions: []
                })
            }


            await this._walletRepository.findOneAndUpdate(
                { _id: inspectorWallet._id },
                {
                    $inc: {
                        balance: inspectorAmount,
                        totalEarned: inspectorAmount
                    },
                    $push: {
                        transactions: {
                            amount: inspectorAmount,
                            type: TransactionType.EARNED,
                            status: TransactionStatus.COMPLETED,
                            reference: inspectionId,
                            description: `Earnings from inspection #${inspection.bookingReference}`
                        }
                    }
                },
            );

            await this._walletRepository.findOneAndUpdate(
                { _id: adminWallet._id },
                {
                    $inc: {
                        balance: platformFee,
                        totalEarned: platformFee
                    },
                    $push: {
                        transactions: {
                            amount: platformFee,
                            type: TransactionType.PLATFORM_FEE,
                            status: TransactionStatus.COMPLETED,
                            reference: inspectionId,
                            description: `Platform fee from inspection #${inspection.bookingReference}`
                        }
                    }
                },
            );

            const inspector = inspection.inspector as unknown as IInspector;
            const user = inspection.user as unknown as IUsers;

            // Notify inspector about the earnings
            await this._notificationService.createAndSendNotification(
                String(inspector._id),
                'Inspector',
                NotificationType.PAYMENT_RECEIVED,
                'Payment Received',
                `You have received a payment of ${inspectorAmount} for inspection #${inspection.bookingReference}`,
                {
                    inspectionId: inspection._id,
                    amount: inspectorAmount
                }
            );

            await this._notificationService.createAndSendNotification(
                String(user._id),
                'User',
                NotificationType.INSPECTION_COMPLETED,
                'Inspection Report Successful',
                `Your Inspection is completed ready to download`,
                {
                    inspectionId: inspection._id,
                    amount: inspectorAmount
                }
            )

            return { platformFee, inspectorEarnings: inspectorAmount }
        } catch (error) {
            console.error(`Error in process earning fund`, error);
            throw new ServiceError('Error in process earning fund');
        }

    }

    async cancelPayment(paymentIntentId: string, userId: string): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            //get payment and verify ownerShip
            const payment = await this._paymentRepository.findOne({
                stripePaymentIntentId: paymentIntentId,
                user: new Types.ObjectId(userId)
            })
            if (!payment) {
                throw new ServiceError('Payment not found or unauthorized');
            }

            // Cancel the payment intent in Stripe
            await stripe.paymentIntents.cancel(paymentIntentId);

            await this._paymentRepository.updatePayment(paymentIntentId, {
                status: PaymentStatus.CANCELLED
            });

            await this._inspectionRepository.update(
                payment.inspection,
                { status: InspectionStatus.CANCELLED }
            );

            //Unbook the inspection by the inspector profile
            await this._inspectionService.cancelInspection(payment.inspection.toString());
            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            console.error('Error cancelling payment:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    async cancelSuccessfulPayment(paymentIntentId: string, userId: string): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const payment = await this._paymentRepository.findOne({
                stripePaymentIntentId: paymentIntentId,
                user: new Types.ObjectId(userId),
                status: PaymentStatus.SUCCEEDED
            })

            if (!payment) {
                throw new ServiceError('Payment not found or unauthorized');
            }

            const paymentTime = new Date(payment.createdAt).getTime();
            const currentTime = new Date().getTime();

            if (currentTime - paymentTime > this.CANCEL_WINDOW_MS) {
                throw new ServiceError('Cancellation window has Expired')
            }
            // Create refund in Stripe
            await stripe.refunds.create({
                payment_intent: paymentIntentId
            })
            // Update payment status
            await this._paymentRepository.updatePayment(paymentIntentId, {
                status: PaymentStatus.REFUNDED
            })

            await this._walletRepository.processRefundToUserWallet(
                userId,
                payment.amount,
                payment.inspection.toString(),
                `Refund for inspection #${payment.inspection.toString()}`
            );

            //Cancel Inspection
            await this._inspectionRepository.update(
                payment.inspection,
                { status: InspectionStatus.CANCELLED }
            )

            await this._inspectionService.cancelInspection(payment.inspection.toString())
            await session.commitTransaction();
        } catch (error) {
            await session.commitTransaction();
            console.error('Error cancelling successful payment:', error)
            throw error;
        } finally {
            session.endSession();
        }
    }
}
