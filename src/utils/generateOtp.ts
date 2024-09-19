import crypto from "node:crypto";

export const generateOtp = (): { otp: string; otpExpiry: Date } => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return { otp, otpExpiry };
};
