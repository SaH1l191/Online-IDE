"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "@/features/auth/components/UserButton";
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-4xl">

        <div className="flex items-center justify-between px-6 py-3 rounded-2xl border 
        border-zinc-200/60 
        // dark:border-zinc-800
        backdrop-blur-xl
        bg-white/70 dark:bg-zinc-900/60
        shadow-lg">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-black dark:text-white">
              <Image
                src="/vscode.svg"
                alt="IntelliCode"
                width={36}
                height={36}
                className="dark:invert"
              />
              <span className="font-bold text-lg hidden sm:block">
                IntelliCode
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">

              <Link
                href="/dashboard"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                href="#features"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
              >
                Features
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">

            <ThemeToggle />
            <UserButton />

          </div>
        </div>

      </div>
    </header>
  );
}