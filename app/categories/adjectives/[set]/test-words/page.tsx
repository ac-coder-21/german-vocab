import { notFound } from "next/navigation";

import { getAdjectivesBySets } from "@/lib/db/adjectives";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestWordsDeck } from "@/components/adjectives/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const adjectives = await getAdjectivesBySets(setNumbers);

  return <TestWordsDeck adjectives={adjectives} setNumbers={setNumbers} />;
}
