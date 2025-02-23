import express, { Request, Response } from "express";
import { authorizeRole } from "../middlewares/role.middleware";
import { container } from "../di/container";
import { PaymentController } from "../controllers/payment.controller";
import { TYPES } from "../di/types";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = express.Router()

const paymentController = container.get<PaymentController>(TYPES.PaymentController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

//for get all payments
router.get('/', authenticateToken, authorizeRole('user'), async (req: Request, res: Response) => {
    await paymentController.findPayments(req, res)
})

router.post(
    '/create-payment-intent',
    authenticateToken,
    async (req: Request, res: Response) => {
        await paymentController.createPaymentIntent(req, res);
    }
);

router.post(
    '/webhook',
    express.raw({ type: "application/json" }),
    async (req, res) => {
        await paymentController.handleWebhook(req, res)
    }
)


router.get(
    '/verify/:paymentIntentId',
    authenticateToken,
    async (req, res) => {
        await paymentController.verifyPayment(req, res);
    }
)

export default router;