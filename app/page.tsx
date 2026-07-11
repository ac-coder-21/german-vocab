"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Languages } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
      <AuroraBackground />

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur"
        >
          <Languages className="size-4" />
          Deutsch lernen, leicht gemacht
        </motion.div>

        <h1 className="max-w-3xl text-balance bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          Vocabulary Test by AC
        </h1>

        <p className="max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
          Sharpen your German — nouns, verbs, adjectives, and everything in
          between — one test at a time.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2"
        >
          <Button
            render={<Link href="/categories" />}
            nativeButton={false}
            size="lg"
            className="group h-13 rounded-full px-8 text-base shadow-lg shadow-primary/20"
          >
            Get Started
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );
}
