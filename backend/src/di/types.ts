export const TYPES = {
    //repository
    UserRepository: Symbol.for('UserRepository'),
    InspectorRepository: Symbol.for('InspectorRepository'),
    InspectionRepository: Symbol.for('InspectionRepository'),
    PaymentRepository: Symbol.for('PaymentRepository'),
    VehicleRepository: Symbol.for('VehicleRepository'),
    AdminRepository: Symbol.for('AdminRepository'),

    //services
    UserService: Symbol.for('UserServices'),
    InspectorService: Symbol.for('InspectorService'),
    InspectionService: Symbol.for('InspectionService'),
    PaymentService: Symbol.for('PaymentService'),
    VehicleService: Symbol.for('VehicleService'),
    EmailService: Symbol.for('EmailService'),
    AdminService: Symbol.for('AdminService'),

    //Auth Services
    AdminAuthService: Symbol.for('AdminAuthService'),
    InspectorAuthService: Symbol.for('InspectorAuthService'),
    UserAuthService: Symbol.for('UserAuthService'),

    //Controllers
    UserController: Symbol.for('UserController'),
    InspectorController: Symbol.for('InspectorController'),
    InspectionController: Symbol.for('InspectionController'),
    PaymentController: Symbol.for('PaymentController'),
    VehicleController: Symbol.for('VehicleController'),
    AdminController: Symbol.for('AdminController'),

    //Auth Controllers
    AdminAuthController: Symbol.for('AdminAuthController'),
    InspectorAuthController: Symbol.for('InspectorAuthController'),
    UserAuthController: Symbol.for('UserAuthController'),

    //middleware
    AuthMiddleware: Symbol.for('AuthMiddleware'),
    PaymentStatusChecker: Symbol.for('PaymentStatusChecker')
};