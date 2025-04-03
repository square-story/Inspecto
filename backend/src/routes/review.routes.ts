import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { IReviewController } from "../core/interfaces/controllers/review.controller.interface";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const reviewController = container.get<IReviewController>(TYPES.ReviewController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const reviewRouter = Router()


reviewRouter.post('/', authMiddleware.authenticateToken, authorizeRole('user'), reviewController.createReview)
reviewRouter.get('/inspector/:inspectorId', reviewController.getInspectorReviews);
reviewRouter.get('/inspector/:inspectorId/rating', reviewController.getInspectorRating);
reviewRouter.get('/inspection/:inspectionId', authMiddleware.authenticateToken, reviewController.getInspectionReview)


export default reviewRouter


