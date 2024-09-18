import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authoptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Handle logic for Google/GitHub sign-in (as before)
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email || "";
        let name = user.name || "";
        let surname = "";

        // Split name and surname if available
        if (account.provider === "google" && name) {
          [name, surname] = name.split(" ", 2);
        } else if (account.provider === "github" && user.name) {
          [name, surname] = user.name.split(" ", 2);
        }

        // Upsert user in Prisma
        await prisma.users.upsert({
          where: { email },
          update: { name, surname },
          create: { email, name, surname, password: null },
        });
        return true;
      }

      if (account?.provider === "credentials") {
        if (!user) {
          // Error occurred during credentials login
		  console.log("Error while credentials")
          return false;
        }
        return true;
      }

      return false;
    },
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
};
