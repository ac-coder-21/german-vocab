import { notFound } from "next/navigation";

import { getVerbsBySet } from "@/lib/db/verbs";
import { LearnConjugationDeck } from "@/components/verbs/learn-conjugation-deck";

export default async function LearnConjugationPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const verbs = await getVerbsBySet(setNumber);

  return <LearnConjugationDeck verbs={verbs} setNumber={setNumber} />;
}
