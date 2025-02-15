import express, { Request, Response } from "express";
import PaymentController from "../controllers/payment.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router()

const paymentController = new PaymentController()

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