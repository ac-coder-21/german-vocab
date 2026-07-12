"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Pencil, Shuffle } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SetPicker } from "@/components/set-picker";
import type { OppositeSet } from "@/lib/db/opposites";

export function OppositesHome({ sets }: { sets: OppositeSet[] }) {
  const [selectedSets, setSelectedSets] = useState<number[]>(
    sets[0] ? [sets[0].setNumber] : []
  );
  const hasSets = sets.length > 0;
  const hasSelection = selectedSets.length > 0;

  const toggleSet = (setNumber: number) => {
    setSelectedSets((prev) => {
      if (prev.includes(setNumber)) {
        if (prev.length === 1) return prev;
        return prev.filter((n) => n !== setNumber);
      }
      return [...prev, setNumber].sort((a, b) => a - b);
    });
  };

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Button
            render={<Link href="/categories/adjectives" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="absolute -top-4 left-0 sm:top-0"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <p className="text-sm font-medium text-muted-foreground">Gegenteile</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Opposites</h1>
          <p className="max-w-lg text-balance text-lg text-muted-foreground">
            Pick one or more sets to test yourself on the opposite of each word.
          </p>
        </motion.div>

        {hasSets && (
          <SetPicker sets={sets} selected={selectedSets} onToggle={toggleSet} />
        )}

        <Link
          href="/categories/adjectives/opposites/manage"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          Manage sets
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          whileHover={hasSelection ? { y: -4 } : undefined}
          className="w-full max-w-sm"
        >
          {hasSelection ? (
            <Link
              href={`/categories/adjectives/opposites/${selectedSets.join(",")}/test`}
              className="block"
            >
              <Card className="group gap-3 overflow-hidden bg-card/70 p-6 text-center shadow-sm backdrop-blur transition-shadow hover:shadow-md hover:ring-foreground/20">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 text-violet-500">
                  <Shuffle className="size-6" />
                </div>
                <h2 className="text-xl font-semibold">Test Opposites</h2>
                <p className="text-muted-foreground">
                  See a word, type its opposite.
                </p>
                <span className="mx-auto mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground/80">
                  Start
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ) : (
            <Card className="gap-2 bg-card/70 p-6 text-center opacity-60 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold">No sets yet</h2>
              <p className="text-muted-foreground">
                Add a set of opposite pairs to start testing.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
