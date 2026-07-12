import { notFound } from "next/navigation";

import { getVerbsBySets } from "@/lib/db/verbs";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestConjugationDeck } from "@/components/verbs/test-conjugation-deck";

export default async function TestConjugationPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const verbs = await getVerbsBySets(setNumbers);

  return <TestConjugationDeck verbs={verbs} setNumbers={setNumbers} />;
}
