import express, { } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IPaymentController } from "../core/interfaces/controllers/payment.controller.interface";

const router = express.Router()

const paymentController = container.get<IPaymentController>(TYPES.PaymentController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

//for get all payments
router.get('/', authenticateToken, authorizeRole('user'), paymentController.findPayments)

router.post(
    '/create-payment-intent',
    authenticateToken,
    paymentController.createPaymentIntent
);

router.post(
    '/webhook',
    express.raw({ type: "application/json" }),
    paymentController.handleWebhook
)


router.get(
    '/verify/:paymentIntentId',
    authenticateToken,
    paymentController.verifyPayment
)

export default router;