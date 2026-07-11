import { notFound } from "next/navigation";

import { getVerbsBySet } from "@/lib/db/verbs";
import { TestConjugationDeck } from "@/components/verbs/test-conjugation-deck";

export default async function TestConjugationPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const verbs = getVerbsBySet(setNumber);

  return <TestConjugationDeck verbs={verbs} setNumber={setNumber} />;
}
