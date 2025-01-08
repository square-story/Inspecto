import { AdminRepository } from "../../repositories/admin.repository";
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from "../../utils/token.utils";

export class AdminAuthService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository()
    }
    async login(email: string, password: string) {
        const admin = await this.adminRepository.findByEmail(email)
        if (!admin || admin.password !== password) {
            throw new Error('Invalid username or password')
        }
        const payload = { userId: admin._id, role: admin.role }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        return { accessToken, refreshToken }
    }

    async refreshToken(token: string) {
        const payload = verifyAccessToken(token)
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload')
        }
        const newAccessToken = generateAccessToken({ userId: payload.userId, role: payload.role })
        return { accessToken: newAccessToken }
    }
}