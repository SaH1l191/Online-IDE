import { Header } from "@/features/home/components/Header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: {
    template: "IntelliCode -Online Web Editor",
    default: "Code Editor For Everyone",
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
 
      <div
        className={cn(
          "relative inset-0 opacity-40",
          "[background-size:60px_60px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]", 
        )}
      />  
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] dark:bg-black" />
 
      <main className="relative z-20 w-full">
        {children}
      </main> 
    </>
  );
}