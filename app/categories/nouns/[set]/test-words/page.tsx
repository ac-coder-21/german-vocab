import { notFound } from "next/navigation";

import { getNounsBySet } from "@/lib/db/nouns";
import { TestWordsDeck } from "@/components/nouns/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const nouns = await getNounsBySet(setNumber);

  return <TestWordsDeck nouns={nouns} setNumber={setNumber} />;
}
