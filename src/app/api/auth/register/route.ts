import emailVerification from "@/utils/emailValidator";
import { generateOtp } from "@/utils/generateOtp";
import { prisma } from "@/utils/prisma"; // Prisma client instance
import responseSender from "@/utils/responseSender";
import sendEmail from "@/utils/sendEmail";
import bcrypt from "bcryptjs";

const POST = async (req: Request) => {
  const { name, surname, email, password } = await req.json();

  const emailField = await emailVerification(email);

  if (!name || !surname || !emailField || !password) {
    return responseSender(
      { message: "All fields are required or email invalid" },
      400
    );
  }

  // Check if the user already exists
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return responseSender(
      { message: "User already exists. Please log in." },
      401
    );
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // otp generate
  const { otp, otpExpiry } = generateOtp();

  // Create the new user
  const newUser = await prisma.users.create({
    data: {
      email,
      name,
      surname,
      password: hashedPassword, // Store the hashed password
      otp,
      otpExpiry,
    },
  });

  await sendEmail({
    email: newUser.email,
    subject: "OTP for Email Verification",
    message: `Your OTP code is ${otp}`,
  });

  return responseSender(
    {
      message: "User registered successfully. Please check email for otp",
      user: newUser.id,
    },
    201
  );
};

const PUT = async (req: Request) => {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return responseSender(
      { message: "All required fields must be filled" },
      400
    );
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) return responseSender({ message: "User not found" }, 401);

    if (user?.otpExpiry && new Date() < user.otpExpiry && user.otp === otp) {
      return responseSender({ message: "User verified" }, 200);
    }

    return responseSender({ message: "OTP invalid or expired" }, 403);
  } catch (error) {
    console.log("Error register::otp -> ", error);
    return responseSender({ message: "Unexpeted issue occured" }, 500);
  }
};

export { POST, PUT };
