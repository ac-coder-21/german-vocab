"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, ListChecks, Pencil, Repeat, SpellCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { VerbSet } from "@/lib/db/verbs";

type Mode = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  href?: (setNumber: number) => string;
};

const modes: Mode[] = [
  {
    key: "learn",
    title: "Learn",
    description: "Flip through flashcards — swipe for the next verb.",
    icon: BookOpen,
    accent: "from-sky-500/15 text-sky-500",
    href: (setNumber) => `/categories/verbs/${setNumber}/learn`,
  },
  {
    key: "test-words",
    title: "Test Words",
    description: "Recall the German verb for each English prompt.",
    icon: ListChecks,
    accent: "from-amber-500/15 text-amber-500",
    href: (setNumber) => `/categories/verbs/${setNumber}/test-words`,
  },
  {
    key: "learn-conjugation",
    title: "Learn Conjugation",
    description: "ich, du, er/sie/es, wir, ihr, sie/Sie for each verb.",
    icon: Repeat,
    accent: "from-violet-500/15 text-violet-500",
    href: (setNumber) => `/categories/verbs/${setNumber}/learn-conjugation`,
  },
  {
    key: "test-conjugation",
    title: "Test Conjugation",
    description: "Type the correct form for a verb and pronoun.",
    icon: SpellCheck,
    accent: "from-rose-500/15 text-rose-500",
    href: (setNumber) => `/categories/verbs/${setNumber}/test-conjugation`,
  },
];

export function VerbsHome({ sets }: { sets: VerbSet[] }) {
  const [selectedSet, setSelectedSet] = useState(sets[0]?.setNumber ?? 0);

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Button
            render={<Link href="/categories" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="absolute -top-4 left-0 sm:top-0"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <p className="text-sm font-medium text-muted-foreground">Verben</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Verbs</h1>
          <p className="max-w-lg text-balance text-lg text-muted-foreground">
            Pick a set, then choose how you want to practice.
          </p>
        </motion.div>

        {sets.length > 0 && (
          <Select
            value={String(selectedSet)}
            onValueChange={(value) => setSelectedSet(Number(value))}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select a set" />
            </SelectTrigger>
            <SelectContent>
              {sets.map((set) => (
                <SelectItem key={set.setNumber} value={String(set.setNumber)}>
                  Set {set.setNumber} ({set.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Link
          href="/categories/verbs/manage"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          Manage sets
        </Link>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode, index) => {
            const enabled = Boolean(mode.href) && sets.length > 0;

            const cardBody = (
              <Card
                className={cn(
                  "group h-full gap-3 overflow-hidden bg-card/70 p-6 shadow-sm backdrop-blur transition-shadow",
                  enabled
                    ? "hover:shadow-md hover:ring-foreground/20"
                    : "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "mb-2 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    mode.accent
                  )}
                >
                  <mode.icon className="size-6" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold">{mode.title}</h2>
                  {!enabled && <Badge variant="secondary">Coming soon</Badge>}
                </div>
                <p className="text-muted-foreground">{mode.description}</p>
                {enabled && (
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground/80">
                    Start
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Card>
            );

            return (
              <motion.div
                key={mode.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                whileHover={enabled ? { y: -4 } : undefined}
              >
                {enabled && mode.href ? (
                  <Link href={mode.href(selectedSet)} className="block h-full">
                    {cardBody}
                  </Link>
                ) : (
                  cardBody
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
