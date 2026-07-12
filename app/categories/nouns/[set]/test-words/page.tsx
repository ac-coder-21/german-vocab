import { notFound } from "next/navigation";

import { getNounsBySets } from "@/lib/db/nouns";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestWordsDeck } from "@/components/nouns/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const nouns = await getNounsBySets(setNumbers);

  return <TestWordsDeck nouns={nouns} setNumbers={setNumbers} />;
}
