import { notFound } from "next/navigation";

import { getNounsBySets } from "@/lib/db/nouns";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestGenderDeck } from "@/components/nouns/test-gender-deck";

export default async function TestGenderPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const nouns = await getNounsBySets(setNumbers);

  return <TestGenderDeck nouns={nouns} setNumbers={setNumbers} />;
}
