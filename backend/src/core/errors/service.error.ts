export class ServiceError extends Error {
    constructor(
        public message: string,
        public field?: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'ServiceError';
    }
}