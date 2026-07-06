
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


const SignInForm = () => {
    return (
        <Card className="w-full max-w-md rounded-xl !shadow-none !border-border/50 glass">
            <CardHeader className="space-y-3 py-6">
                <CardTitle className="text-3xl font-extrabold text-center text-foreground">
                    Welcome Back!
                </CardTitle>
                <CardDescription className="text-center text-lg text-muted-foreground">
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
                        className="w-full hover:cursor-pointer h-12 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-accent/10 hover:border-accent/30 focus:outline-none gradient-border"
                    >
                        <Chrome className="mr-3 h-5 w-5 text-accent" />
                        <span className="text-lg font-medium text-foreground">Sign in with Google</span>
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
                        className="w-full hover:cursor-pointer h-12 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-primary/10 hover:border-primary/30 focus:outline-none gradient-border"
                    >
                        <Github className="mr-3 h-5 w-5 text-primary" />
                        <span className="text-lg font-medium text-foreground">Sign in with GitHub</span>
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="mt-4">
                <p className="text-sm text-center text-muted-foreground w-full">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline text-accent hover:text-accent/80">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline text-accent hover:text-accent/80">
                        Privacy Policy
                    </a>
                    .
                </p>
            </CardFooter>

        </Card>
    );
};

export default SignInForm;
