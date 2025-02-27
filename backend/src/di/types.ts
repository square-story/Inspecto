export const TYPES = {
    //Admin
    AdminRepository: Symbol.for('AdminRepository'),
    AdminService: Symbol.for('AdminService'),
    AdminController: Symbol.for('AdminController'),

    //User
    UserRepository: Symbol.for('UserRepository'),
    UserService: Symbol.for('UserService'),
    UserController: Symbol.for('UserController'),

    //Inspector
    InspectorRepository: Symbol.for('InspectorRepository'),
    InspectorService: Symbol.for('InspectorService'),
    InspectorController: Symbol.for('InspectorController'),

    //Inspection
    InspectionRepository: Symbol.for('InspectionRepository'),
    InspectionService: Symbol.for('InspectionService'),
    InspectionController: Symbol.for('InspectionController'),

    //Payment
    PaymentRepository: Symbol.for('PaymentRepository'),
    PaymentService: Symbol.for('PaymentService'),
    PaymentController: Symbol.for('PaymentController'),

    //Vehicle
    VehicleRepository: Symbol.for('VehicleRepository'),
    VehicleService: Symbol.for('VehicleService'),
    VehicleController: Symbol.for('VehicleController'),

    //Email
    EmailService: Symbol.for('EmailService'),

    //Auth Services
    AdminAuthService: Symbol.for('AdminAuthService'),
    InspectorAuthService: Symbol.for('InspectorAuthService'),
    UserAuthService: Symbol.for('UserAuthService'),

    //Auth Controllers
    AdminAuthController: Symbol.for('AdminAuthController'),
    InspectorAuthController: Symbol.for('InspectorAuthController'),
    UserAuthController: Symbol.for('UserAuthController'),

    //middleware
    AuthMiddleware: Symbol.for('AuthMiddleware'),
    PaymentStatusChecker: Symbol.for('PaymentStatusChecker')
};