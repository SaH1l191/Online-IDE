

export const publicRoutes: string[] = []
export const protectedRoutes: string[] = ["/"]
export const authRoutes: string[] = [
    "/auth/sign-in",   // Added leading slash

]
export const apiAuthPrefix: string = "/api/auth"
export const DEFAULT_LOGIN_REDIRECT = "/"