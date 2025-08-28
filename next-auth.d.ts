import { UserRole } from "@prisma/client"
import { JWT } from "next-auth/jwt";
import NextAuth, { type DefaultSession } from "next-auth";


// to remove the type error from the auth.ts in line 85 so adding the userRole into the jwt and session 

export type ExtendedUser = {
    role: UserRole
} & DefaultSession["user"];



declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}


declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole;
    }
}