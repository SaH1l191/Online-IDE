"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";




export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
//context behind the mounted state variable 


//When using Next.js, parts of your app might render on the server first 
// (before the browser runs any JavaScript). This can cause 
// problems if you're using something like localStorage or reading the user's 
// theme — because that only works in the browser, not on the server.
    return (
        <div
            className="cursor-pointer"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
            }}
        >
            {
                theme === "light" ? (<Moon className="h-5 w-5 text-black" />) : 
                (<Sun className="h-5 w-5 text-white" color="white" />)
            }
        </div>
    )
}