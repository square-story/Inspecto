import { Container } from "inversify";
import { TYPES } from "./types";

// Repositories
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { UserRepository } from "../repositories/user.repository";
import { IInspectorRepository, } from "../core/interfaces/repositories/inspector.repository.interface";
import { InspectorRepository } from "../repositories/inspector.repository";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { InspectionRepository } from "../repositories/inspection.repository";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import { PaymentRepository } from "../repositories/payment.repository";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";
import { VehicleRepository } from "../repositories/vehicle.repository";

// Services
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { UserService } from "../services/user.service";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { InspectorService } from "../services/inspector.service";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { InspectionService } from "../services/inspection.service";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { PaymentService } from "../services/payment.service";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { VehicleService } from "../services/vehicle.service";
import { IEmailService } from "../core/interfaces/services/email.service.interface";
import { EmailService } from "../services/email.service";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { AdminService } from "../services/admin.service";
import { InspectorAuthService } from "../services/auth/inspector.auth.service";
import { UserAuthService } from "../services/auth/user.auth.service";
import { AdminAuthService } from "../services/auth/admin.auth.service";

// Controllers
import { IUserController } from "../core/interfaces/controllers/user.controller.interface";
import { UserController } from "../controllers/user.controller";
import { IInspectorController } from "../core/interfaces/controllers/inspector.controller.interface";
import { InspectorController } from "../controllers/inspector.controller";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";
import { InspectionController } from "../controllers/inspection.controller";
import { IPaymentController } from "../core/interfaces/controllers/payment.controller.interface";
import { PaymentController } from "../controllers/payment.controller";
import { IVehicleController } from "../core/interfaces/controllers/vehicle.controller.interface";
import { VehicleController } from "../controllers/vehicle.controller";
import { UserAuthController } from "../controllers/auth/user.auth.controller";
import { InspectorAuthController } from "../controllers/auth/inspector.auth.controller";
import { AdminAuthController } from "../controllers/auth/admin.auth.controller";

//middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PaymentStatusChecker } from "../utils/checkPaymentStatus";
import { IAuthService } from "../core/interfaces/services/auth.service.interface";
import { AdminRepository } from "../repositories/admin.repository";
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";
import { IAuthController } from "../core/interfaces/controllers/auth.controller.interface";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";
import { AdminController } from "../controllers/admin.controller";




const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IInspectorRepository>(TYPES.InspectorRepository).to(InspectorRepository);
container.bind<IInspectionRepository>(TYPES.InspectionRepository).to(InspectionRepository);
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);
container.bind<IVehicleRepository>(TYPES.VehicleRepository).to(VehicleRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);

// Bind Services
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IInspectorService>(TYPES.InspectorService).to(InspectorService);
container.bind<IInspectionService>(TYPES.InspectionService).to(InspectionService);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
container.bind<IVehicleService>(TYPES.VehicleService).to(VehicleService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService)

//Bind Auth Services

container.bind<IAuthService>(TYPES.InspectorAuthService).to(InspectorAuthService);
container.bind<IAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IAuthService>(TYPES.AdminAuthService).to(AdminAuthService);

// Bind Controllers
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IInspectorController>(TYPES.InspectorController).to(InspectorController);
container.bind<IInspectionController>(TYPES.InspectionController).to(InspectionController);
container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController);
container.bind<IVehicleController>(TYPES.VehicleController).to(VehicleController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController)

//Auth controller
container.bind<IAuthController>(TYPES.UserAuthController).to(UserAuthController);
container.bind<IAuthController>(TYPES.InspectorAuthController).to(InspectorAuthController);
container.bind<IAuthController>(TYPES.AdminAuthController).to(AdminAuthController);

//Bind Middleware
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<PaymentStatusChecker>(TYPES.PaymentStatusChecker).to(PaymentStatusChecker);

export { container };