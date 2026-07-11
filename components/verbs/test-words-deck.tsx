"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Verb } from "@/lib/db/verbs";

type Result = {
  verb: Verb;
  userAnswer: string;
  correct: boolean;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function TestWordsDeck({
  verbs,
  setNumber,
}: {
  verbs: Verb[];
  setNumber: number;
}) {
  const [order, setOrder] = useState(() => shuffle(verbs));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const total = order.length;
  const current = order[index];
  const finished = index >= total;

  const lastResult = results[results.length - 1];
  const isCorrect = answered ? (lastResult?.correct ?? false) : false;

  const score = results.filter((r) => r.correct).length;
  const wrongResults = results.filter((r) => !r.correct);

  const handleNext = () => {
    setAnswered(false);
    setInput("");
    setIndex((i) => i + 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!current) return;

    if (answered) {
      handleNext();
      return;
    }

    if (!input.trim()) return;

    const correct = normalize(input) === normalize(current.german);
    setResults((r) => [...r, { verb: current, userAnswer: input.trim(), correct }]);
    setAnswered(true);
  };

  const restart = () => {
    setOrder(shuffle(verbs));
    setIndex(0);
    setInput("");
    setAnswered(false);
    setResults([]);
  };

  if (total === 0) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
        <AuroraBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Set {setNumber} has no verbs yet
          </h1>
          <Button
            render={<Link href="/categories/verbs" />}
            nativeButton={false}
            variant="outline"
          >
            <ArrowLeft className="size-4" />
            Back to verbs
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
        <AuroraBackground />

        <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 text-center">
          <Button
            render={<Link href="/categories/verbs" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="self-start"
          >
            <ArrowLeft className="size-4" />
            Back to verbs
          </Button>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Set {setNumber} results
          </h1>
          <p className="text-lg text-muted-foreground">
            You scored{" "}
            <span className="font-semibold text-foreground">
              {score} / {total}
            </span>
          </p>

          {wrongResults.length === 0 ? (
            <p className="text-muted-foreground">
              Perfect score — every verb correct!
            </p>
          ) : (
            <div className="w-full overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Question</th>
                    <th className="px-4 py-2 font-medium">Your answer</th>
                    <th className="px-4 py-2 font-medium">Correct answer</th>
                  </tr>
                </thead>
                <tbody>
                  {wrongResults.map((r) => (
                    <tr key={r.verb.id} className="border-t">
                      <td className="px-4 py-2">{r.verb.english}</td>
                      <td className="px-4 py-2 text-destructive">
                        {r.userAnswer || "—"}
                      </td>
                      <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">
                        {r.verb.german}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="size-4" />
              Retry
            </Button>
            <Button render={<Link href="/categories/verbs" />} nativeButton={false}>
              <ArrowLeft className="size-4" />
              Back to verbs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between">
          <Button
            render={<Link href="/categories/verbs" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Set {setNumber} · {index + 1} / {total}
          </span>
        </div>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex w-full flex-col items-center gap-4 rounded-3xl border bg-card/80 p-8 text-center shadow-lg backdrop-blur"
        >
          <span className="text-sm font-medium text-muted-foreground">English</span>
          <p className="text-3xl font-bold tracking-tight text-balance">
            {current.english}
          </p>

          <form onSubmit={handleSubmit} className="mt-2 flex w-full flex-col gap-3">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              readOnly={answered}
              placeholder="Type the German verb…"
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-center text-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50 read-only:opacity-70"
            />
            {!answered && (
              <Button type="submit" disabled={!input.trim()}>
                Check
              </Button>
            )}
          </form>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-xl border p-4 text-sm",
                  isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                )}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  {isCorrect ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <XCircle className="size-4" />
                  )}
                  {isCorrect ? "Correct!" : "Not quite"}
                </span>
                {!isCorrect && (
                  <span>
                    The right answer is <strong>{current.german}</strong>.
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <Button onClick={handleNext} className="mt-1">
              {index === total - 1 ? "See results" : "Next"}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
