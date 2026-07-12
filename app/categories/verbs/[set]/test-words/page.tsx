import { notFound } from "next/navigation";

import { getVerbsBySets } from "@/lib/db/verbs";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { TestWordsDeck } from "@/components/verbs/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const verbs = await getVerbsBySets(setNumbers);

  return <TestWordsDeck verbs={verbs} setNumbers={setNumbers} />;
}
