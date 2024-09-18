import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@domain.com",
        },
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
      // Handle logic for Google/GitHub sign-in
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
      }

      return true;
    },
    async session({ session, token }) {
      if (token?.id && session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
  },
};
