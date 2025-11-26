import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { client } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./features/auth/actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user || !account) return false;
            const existingUser = await client.user.findUnique({
                where: { email: user.email! }
            })

            if (!existingUser) {
                const newUser = await client.user.create({
                    data: {
                        email: user.email!,
                        name: user.name,
                        image: user.image,
                        accounts: {
                            // @ts-ignore
                            create: {
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refreshToken: account.refresh_token,
                                accessToken: account.access_token,
                                expiresAt: account.expires_at,
                                tokenType: account.token_type,
                                scope: account.scope,
                                idToken: account.id_token,
                                sessionState: account.session_state,
                            }
                        }
                    }
                })
                if (!newUser) return false;
            } else {
                const existingAccount = await client.account.findUnique({
                    where: {
                        provider_providerAccountId: { 
                            provider: account.provider,
                            providerAccountId: account.providerAccountId
                        }
                    }
                })

                if (!existingAccount) {
                    await client.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refreshToken: account.refresh_token,
                            accessToken: account.access_token,
                            expiresAt: account.expires_at,
                            tokenType: account.token_type,
                            scope: account.scope,
                            idToken: account.id_token,
                            // @ts-ignore
                            sessionState: account.session_state,
                        },
                    });
                }
            }
            return true;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            console.log("JWt token sub", token.sub);
            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token;

            token.name = existingUser.name
            token.emaile = existingUser.name
            token.role = existingUser.role
            return token;
        },
        async session({ session, token }) {
            //subject in jwt in token 
            //each session has unq user
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.sub && session.user) {
                session.user.role = token.role
            }
            // console.log("session ", session)
            return session
        }
    },
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(client),
    session: { strategy: "jwt" },
    ...authConfig
})


