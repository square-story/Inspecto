import { Container } from "inversify";
import { TYPES } from "./types";



//Admin
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";
import { AdminRepository } from "../repositories/admin.repository";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { AdminService } from "../services/admin.service";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";
import { AdminController } from "../controllers/admin.controller";

//User
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { UserService } from "../services/user.service";
import { IUserController } from "../core/interfaces/controllers/user.controller.interface";
import { UserController } from "../controllers/user.controller";

//Inspector
import { IInspectorRepository, } from "../core/interfaces/repositories/inspector.repository.interface";
import { InspectorRepository } from "../repositories/inspector.repository";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { InspectorService } from "../services/inspector.service";
import { IInspectorController } from "../core/interfaces/controllers/inspector.controller.interface";
import { InspectorController } from "../controllers/inspector.controller";


//Inspection
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { InspectionRepository } from "../repositories/inspection.repository";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { InspectionService } from "../services/inspection.service";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";
import { InspectionController } from "../controllers/inspection.controller";

//Payment
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import { PaymentRepository } from "../repositories/payment.repository";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { PaymentService } from "../services/payment.service";
import { IPaymentController } from "../core/interfaces/controllers/payment.controller.interface";
import { PaymentController } from "../controllers/payment.controller";

//Vehicle
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { VehicleService } from "../services/vehicle.service";
import { IVehicleController } from "../core/interfaces/controllers/vehicle.controller.interface";
import { VehicleController } from "../controllers/vehicle.controller";


//Wallet
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { WalletRepository } from "../repositories/wallet.repository";

//Email
import { IEmailService } from "../core/interfaces/services/email.service.interface";
import { EmailService } from "../services/email.service";

//Review

import { InspectorAuthService } from "../services/auth/inspector.auth.service";
import { UserAuthService } from "../services/auth/user.auth.service";
import { AdminAuthService } from "../services/auth/admin.auth.service";
import { UserAuthController } from "../controllers/auth/user.auth.controller";
import { InspectorAuthController } from "../controllers/auth/inspector.auth.controller";
import { AdminAuthController } from "../controllers/auth/admin.auth.controller";

//middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PaymentStatusChecker } from "../utils/checkPaymentStatus";


import { IAdminAuthService, IInspectorAuthService, IUserAuthService } from "../core/interfaces/services/auth.service.interface";
import { IAdminAuthController, IInspectorAuthController, IUserAuthController } from "../core/interfaces/controllers/auth.controller.interface";
import { CloudinaryController } from "../controllers/cloudinary.controller";
import { IReviewRepository } from "../core/interfaces/repositories/review.repository.interface";
import { ReviewRepository } from "../repositories/review.repository";
import { IReviewService } from "../core/interfaces/services/review.service.interface";
import { ReviewService } from "../services/review.service";
import { IReviewController } from "../core/interfaces/controllers/review.controller.interface";
import { ReviewController } from "../controllers/review.controller";
import { IWithdrawalRepository } from "../core/interfaces/repositories/withdrawal.repository.interface";
import { WithdrawalRepository } from "../repositories/withdrawal.repository";
import { IWithDrawalService } from "../core/interfaces/services/withdrawal.service.interface";
import { WithdrawalService } from "../services/withdrawal.service";
import { IWithDrawalController } from "../core/interfaces/controllers/withdrawal.controller.interface";
import { WithdrawalController } from "../controllers/withdrawar.controller";
import { IWalletService } from "../core/interfaces/services/wallet.service.interface";
import { WalletService } from "../services/wallet.service";
import { IWalletController } from "../core/interfaces/controllers/wallet.controller.interface";
import { WalletController } from "../controllers/wallet.controller";



const container = new Container();


//Admin
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

// User
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserController>(TYPES.UserController).to(UserController);

//Inspector
container.bind<IInspectorRepository>(TYPES.InspectorRepository).to(InspectorRepository);
container.bind<IInspectorService>(TYPES.InspectorService).to(InspectorService);
container.bind<IInspectorController>(TYPES.InspectorController).to(InspectorController);

//Inspection
container.bind<IInspectionRepository>(TYPES.InspectionRepository).to(InspectionRepository);
container.bind<IInspectionService>(TYPES.InspectionService).to(InspectionService);
container.bind<IInspectionController>(TYPES.InspectionController).to(InspectionController);

//Payment
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController);

//Vehicle
container.bind<IVehicleRepository>(TYPES.VehicleRepository).to(VehicleRepository);
container.bind<IVehicleService>(TYPES.VehicleService).to(VehicleService);
container.bind<IVehicleController>(TYPES.VehicleController).to(VehicleController);

//Wallet
container.bind<IWalletRepository>(TYPES.WalletRepository).to(WalletRepository);
container.bind<IWalletService>(TYPES.WalletService).to(WalletService);
container.bind<IWalletController>(TYPES.WalletController).to(WalletController);


//WithDrawal
container.bind<IWithdrawalRepository>(TYPES.WithdrawalRepository).to(WithdrawalRepository);
container.bind<IWithDrawalService>(TYPES.WithdrawalService).to(WithdrawalService);
container.bind<IWithDrawalController>(TYPES.WithdrawalContoller).to(WithdrawalController);

//Review
container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository);
container.bind<IReviewService>(TYPES.ReviewService).to(ReviewService);
container.bind<IReviewController>(TYPES.ReviewController).to(ReviewController);

//Email
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

//Auth Services
container.bind<IInspectorAuthService>(TYPES.InspectorAuthService).to(InspectorAuthService);
container.bind<IUserAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);

//Auth controller
container.bind<IUserAuthController>(TYPES.UserAuthController).to(UserAuthController);
container.bind<IInspectorAuthController>(TYPES.InspectorAuthController).to(InspectorAuthController);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);

//Bind Middleware
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<PaymentStatusChecker>(TYPES.PaymentStatusChecker).to(PaymentStatusChecker);

//cloudinary
container.bind<CloudinaryController>(TYPES.CloudinaryController).to(CloudinaryController)

export { container };