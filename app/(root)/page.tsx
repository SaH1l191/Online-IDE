"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Rocket, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const codeLines = [
  { text: 'const greet = (name: string) => {', delay: 0 },
  { text: '  return `Hello, ${name}!`;', delay: 0.4 },
  { text: '};', delay: 0.8 },
  { text: '', delay: 1.0 },
  { text: 'console.log(greet("Developer"));', delay: 1.2 },
  { text: '', delay: 1.6 },
  { text: '// AI: Convert to template literal', delay: 1.8, ai: true },
  { text: '// AI: Add TypeScript generics', delay: 2.2, ai: true },
];

const stats = [
  { icon: Zap, label: "10K+ Developers", color: "text-warning" },
  { icon: Rocket, label: "50K+ Snippets", color: "text-accent" },
  { icon: Shield, label: "Secure & Private", color: "text-green-400" },
];

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Hero */}
      <section className="flex-1 flex items-center max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered IDE
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Build Code with{" "}
              <span className="text-gradient">Intelligence</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              AI-powered online IDE that helps you write, debug, and ship
              faster — right in your browser.
            </p>

            <div className="flex gap-3 pt-2">
              <Link href="/dashboard">
                <Button variant="glow" size="lg">
                  Start Coding
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Live Demo
              </Button>
            </div>
          </motion.div>

          {/* Right — Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl opacity-60" />

            <div className="relative bg-card rounded-xl border border-border p-6 shadow-2xl font-mono text-sm leading-relaxed overflow-hidden">
              {/* Window dots */}
              <div className="flex gap-1.5 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>

              {/* Code lines */}
              <div className="space-y-1">
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: line.delay, duration: 0.3 }}
                    className={line.ai ? "text-accent" : "text-green-400"}
                  >
                    {line.text || "\u00A0"}
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                <motion.span
                  className="inline-block w-2 h-4 bg-primary/80 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Stats */}
      <div className="pb-8 flex justify-center gap-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 glass text-sm"
          >
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <span className="text-muted-foreground font-medium">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
