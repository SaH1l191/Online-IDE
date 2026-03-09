"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <div className="relative z-20 w-full overflow-hidden">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-500 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-30" />
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8  pt-1 "
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Build Code with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
              Intelligence
            </span>
          </h1>
          <div className="text-lg text-zinc-600 dark:text-zinc-400 h-[60px]">
            <TypeAnimation
              sequence={[
                "AI powered code completion",
                2000,
                "Debug smarter not harder",
                2000,
                "Optimize code instantly",
                2000,
              ]}
              repeat={Infinity}
            />
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg">
                Start Coding
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Live Demo
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >

          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-30" />

          <div className="relative bg-black rounded-xl border border-zinc-800 p-6 shadow-2xl">

            <pre className="text-sm text-green-400 font-mono leading-relaxed">
              {`function greet(name) {
  return "Hello " + name;
}

console.log(greet("Developer"));

AI Suggestion:
→ convert to template string
`}
            </pre>

          </div>

        </motion.div>

      </section>

      {/* FEATURES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-12   gap-12 items-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-center mb-12 
                 text-opacity-40
  bg-clip-text  
  "
        >
          Built for Modern Developers
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">

          <FeatureCard
            title="AI Code Generation"
            desc="Generate functions, tests and documentation instantly."
          />

          <FeatureCard
            title="Smart Debugging"
            desc="AI explains errors and fixes them automatically."
          />
          <FeatureCard
            title="Developer Focused"
            desc="Built by developers for developers."
          />

        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl transition"
    >
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-zinc-500 text-sm">{desc}</p>
    </motion.div>
  );
}