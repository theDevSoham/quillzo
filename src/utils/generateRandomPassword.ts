import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const generateRandomPassword = (isHashed: boolean): string => {
  const passStr = crypto.randomBytes(16).toString("hex");
  const hashedPassword = bcrypt.hashSync(passStr, 10);

  return isHashed ? hashedPassword : passStr;
};
