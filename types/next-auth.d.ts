import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: any;
      name: string | null;
      email: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
