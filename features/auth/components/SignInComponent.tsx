import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import { signIn } from "@/auth";


const SignInFormClient = () => {
    return (
        <Card className="w-full max-w-md rounded-xl s  !shadow-none  !border-none">
            <CardHeader className="space-y-3 py-6">
                <CardTitle className="text-3xl font-extrabold text-center text-gray-900">
                    Welcome Back!
                </CardTitle>
                <CardDescription className="text-center text-lg text-gray-600">
                    Choose your preferred sign-in method to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
                {/* Google Sign-In */}
                <form action={async () => {
                    "use server";
                    await signIn("google");
                }}>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full hover:cursor-pointer  h-12 rounded-lg shadow-sm transition-all ease-in-out duration-200 hover:bg-gray-100 focus:outline-none"
                    >
                        <Chrome className="mr-3 h-5 w-5 text-blue-500" />
                        <span className="text-lg font-medium text-gray-700">Sign in with Google</span>
                    </Button>
                </form>

                {/* GitHub Sign-In */}
                <form action={async () => {
                    "use server";
                    await signIn("github");
                }}>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full hover:cursor-pointer h-12 rounded-lg shadow-sm transition-all ease-in-out duration-200 hover:bg-gray-100 hover:text-white focus:outline-none"
                    >
                        <Github className="mr-3 h-5 w-5 text-gray-800" />
                        <span className="text-lg font-medium text-gray-700">Sign in with GitHub</span>
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="mt-4">
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 w-full">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline text-blue-600 hover:text-blue-800">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline text-blue-600 hover:text-blue-800">
                        Privacy Policy
                    </a>
                    .
                </p>
            </CardFooter>

        </Card>
    );
};

export default SignInFormClient;
