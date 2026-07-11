"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OtherWord, OtherWordSet } from "@/lib/db/other-words";
import { NewOtherWordSetForm } from "@/components/other-words/new-other-word-set-form";
import { EditOtherWordSetPanel } from "@/components/other-words/edit-other-word-set-panel";

const TABS = [
  { key: "new", label: "New set" },
  { key: "edit", label: "Edit set" },
] as const;

export function ManageOtherWordSets({
  sets,
  selectedSet,
  words,
  nextSetNumber,
}: {
  sets: OtherWordSet[];
  selectedSet: number | undefined;
  words: OtherWord[];
  nextSetNumber: number;
}) {
  const [tab, setTab] = useState<"new" | "edit">("new");

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Button
            render={<Link href="/categories/other-words" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="self-start"
          >
            <ArrowLeft className="size-4" />
            Back to other words
          </Button>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Manage sets
          </h1>
          <p className="max-w-md text-balance text-muted-foreground">
            Add a new set of words, or edit and delete words in an existing
            one.
          </p>
        </motion.div>

        <div className="flex justify-center gap-1 self-center rounded-full border bg-card/60 p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur">
          {tab === "new" ? (
            <NewOtherWordSetForm nextSetNumber={nextSetNumber} />
          ) : (
            <EditOtherWordSetPanel
              sets={sets}
              selectedSet={selectedSet}
              words={words}
            />
          )}
        </div>
      </div>
    </div>
  );
}
