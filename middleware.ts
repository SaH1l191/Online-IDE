
import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, publicRoutes, authRoutes, protectedRoutes } from './routes'
import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)


export default auth((req) => {
    console.log("middleware file ")
    // only handling the page flow not the API flow
    const { nextUrl } = req
    // console.log("logging middleware req ", req)
    const isLoggedIn = !!req.auth
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);


    if (isApiAuthRoute) return null
    if (isAuthRoute) {
        if (isLoggedIn) {
            //EG Usage => 
            //const nexturl = 'https://example.com';
            // const DEFAULT_LOGIN_REDIRECT = '/login';
            // const redirectURL = new URL(DEFAULT_LOGIN_REDIRECT, nexturl);
            // console.log(redirectURL.href); // "https://example.com/login"
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
            //allow access 
        }
        // deny access 
        return null;
    }
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl))
    }

    return null
})

export const config = {
    // copied from clerk
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
