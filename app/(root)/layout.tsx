import { Header } from "@/features/home/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "IntelliCode — %s",
    default: "IntelliCode — AI-Powered Code Editor",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="relative z-20 w-full">
        {children}
      </main>
    </>
  );
}
