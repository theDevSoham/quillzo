import { NextAuthOptions } from "next-auth";

export const authConfigGeneral: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [],
};
