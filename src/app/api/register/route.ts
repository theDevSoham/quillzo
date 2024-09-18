import { prisma } from "@/utils/prisma"; // Prisma client instance
import bcrypt from "bcryptjs";

const POST = async (req: Request) => {
  const { name, surname, email, password } = await req.json();

  if (!name || !surname || !email || !password) {
    return new Response(
      JSON.stringify({ message: "All fields are required." }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }

  // Check if the user already exists
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "User already exists. Please log in." }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const newUser = await prisma.users.create({
    data: {
      email,
      name,
      surname,
      password: hashedPassword, // Store the hashed password
    },
  });

  return new Response(
    JSON.stringify({
      message: "User registered successfully.",
      user: newUser.id,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 400,
    }
  );
};

export { POST };
