import crypto from "crypto";

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString() //6-digit otp
}