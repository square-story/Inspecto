
export interface IBaseAuthService {
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>
}