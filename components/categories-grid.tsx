"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Palette, Shapes, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CategoryCounts } from "@/lib/db/stats";

type Category = {
  slug: string;
  title: string;
  germanLabel: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  countKey: keyof CategoryCounts;
};

const categories: Category[] = [
  {
    slug: "nouns",
    title: "Nouns",
    germanLabel: "Substantive",
    description: "Der, die, das — build your core vocabulary.",
    icon: BookOpen,
    accent: "from-sky-500/15 text-sky-500",
    countKey: "nouns",
  },
  {
    slug: "verbs",
    title: "Verbs",
    germanLabel: "Verben",
    description: "Actions and conjugations in every tense.",
    icon: Zap,
    accent: "from-amber-500/15 text-amber-500",
    countKey: "verbs",
  },
  {
    slug: "adjectives",
    title: "Adjectives",
    germanLabel: "Adjektive",
    description: "Describe the world with the right endings.",
    icon: Palette,
    accent: "from-violet-500/15 text-violet-500",
    countKey: "adjectives",
  },
  {
    slug: "other-words",
    title: "Other Words",
    germanLabel: "Sonstiges",
    description: "Adverbs, prepositions, and everything else.",
    icon: Shapes,
    accent: "from-emerald-500/15 text-emerald-500",
    countKey: "otherWords",
  },
];

export function CategoriesGrid({ counts }: { counts: CategoryCounts }) {
  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="absolute -top-4 left-0 sm:top-0"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose a category
          </h1>
          <p className="max-w-lg text-balance text-lg text-muted-foreground">
            Pick a word type to start practicing your German vocabulary.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/categories/${category.slug}`} className="block h-full">
                <Card className="group h-full gap-3 overflow-hidden bg-card/70 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-md hover:ring-foreground/20">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent}`}
                    >
                      <category.icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {counts[category.countKey]} word
                      {counts[category.countKey] === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <span className="text-sm text-muted-foreground">
                      {category.germanLabel}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{category.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground/80">
                    Start practicing
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
