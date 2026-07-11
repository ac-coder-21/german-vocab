"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw, Volume2 } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { speakGerman } from "@/lib/speech";
import type { OtherWord } from "@/lib/db/other-words";

const SWIPE_THRESHOLD = 80;

const cardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
    rotate: direction > 0 ? 6 : -6,
  }),
  center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.95,
    rotate: direction > 0 ? -6 : 6,
  }),
};

export function LearnDeck({
  words,
  setNumber,
}: {
  words: OtherWord[];
  setNumber: number;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [direction, setDirection] = useState(1);

  const total = words.length;
  const finished = index >= total;
  const current = words[index];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const goNext = () => {
    if (index >= total) return;
    window.speechSynthesis?.cancel();
    setDirection(1);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index <= 0) return;
    window.speechSynthesis?.cancel();
    setDirection(-1);
    setRevealed(false);
    setIndex((i) => i - 1);
  };

  const restart = () => {
    window.speechSynthesis?.cancel();
    setDirection(-1);
    setRevealed(false);
    setIndex(0);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x >= SWIPE_THRESHOLD) goPrev();
  };

  if (total === 0) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
        <AuroraBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Set {setNumber} has no words yet
          </h1>
          <Button
            render={<Link href="/categories/other-words" />}
            nativeButton={false}
            variant="outline"
          >
            <ArrowLeft className="size-4" />
            Back to other words
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
      <AuroraBackground />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex w-full items-center justify-between">
          <Button
            render={<Link href="/categories/other-words" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Set {setNumber} · {finished ? total : index + 1} / {total}
          </span>
        </div>

        <div className="relative h-80 w-full">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            {!finished ? (
              <motion.div
                key={current.id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                onClick={() => setRevealed((r) => !r)}
                className="absolute inset-0 flex cursor-pointer touch-pan-y select-none flex-col items-center justify-center gap-4 rounded-3xl border bg-card/80 p-8 text-center shadow-lg backdrop-blur active:cursor-grabbing"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {revealed ? "Deutsch" : "English"}
                </span>
                {revealed ? (
                  <div className="flex items-center gap-2">
                    <p className="text-4xl font-bold tracking-tight text-balance">
                      {current.german}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Hear pronunciation"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakGerman(current.german);
                      }}
                    >
                      <Volume2 className="size-5" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-4xl font-bold tracking-tight text-balance">
                    {current.english}
                  </p>
                )}
                <span className="text-xs text-muted-foreground">
                  Tap to {revealed ? "hide" : "reveal"} · swipe for next
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border bg-card/80 p-8 text-center shadow-lg backdrop-blur"
              >
                <p className="text-2xl font-bold tracking-tight">
                  Set {setNumber} complete!
                </p>
                <p className="text-muted-foreground">
                  You reviewed all {total} words.
                </p>
                <Button onClick={restart} variant="outline" className="mt-2">
                  <RotateCcw className="size-4" />
                  Review again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous word"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            disabled={finished}
            aria-label="Next word"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
