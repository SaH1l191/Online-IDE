"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "@/features/auth/components/UserButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl border border-border/50 glass bg-background/70 shadow-lg shadow-black/5">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <Image
                src="/vscode.svg"
                alt="IntelliCode"
                width={32}
                height={32}
                className="dark:invert"
              />
              <span className="font-bold text-lg hidden sm:block tracking-tight">
                IntelliCode
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Features
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
