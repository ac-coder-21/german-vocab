import { notFound } from "next/navigation";

import { getOtherWordsBySets } from "@/lib/db/other-words";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestWordsDeck } from "@/components/other-words/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const words = await getOtherWordsBySets(setNumbers);

  return <TestWordsDeck words={words} setNumbers={setNumbers} />;
}
