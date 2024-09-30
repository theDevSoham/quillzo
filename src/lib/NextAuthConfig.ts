import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { generateRandomPassword } from "@/utils/generateRandomPassword";
import { authConfigGeneral } from "./authConfigGeneral";

export const authOptions: NextAuthOptions = {
  ...authConfigGeneral,
  adapter: PrismaAdapter(prisma),
  // pages: {
  //   signIn: "/auth/login",
  //   signOut: "/auth/logout",
  // },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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

        const user = await prisma.user.findUnique({
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
        const foundUser = await prisma.user.findUnique({
          where: {
            email: user.email as string,
          },

          include: {
            accounts: {
              where: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          },
        });

        if (foundUser) {
          // Check if the user has any accounts that match the specified provider
          if (foundUser.accounts.length > 0) {
            // User found and has accounts with the specified provider
            return true;
          } else {
            // User found but no accounts match the specified provider
            return false;
          }
        } else {
          // User not found
          const email = user.email || "";
          let name = user.name || "";
          let surname = "";

          // Split name and surname if available
          if (account.provider === "google" && name) {
            [name, surname] = name.split(" ", 2);
          } else if (account.provider === "github" && user.name) {
            [name, surname] = user.name.split(" ", 2);
          }

          console.log("User details: ", user, name, surname, email);

          // Upsert user in Prisma
          await prisma.user.upsert({
            where: { email },
            update: { name, surname },
            create: {
              email,
              name,
              surname,
              password: generateRandomPassword(true),
            },
          });

          return true;
        }
      }

      if (account?.provider === "credentials") {
        if (!user) {
          // no user found with email
          return false;
        }
        return true;
      }

      return false;
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
