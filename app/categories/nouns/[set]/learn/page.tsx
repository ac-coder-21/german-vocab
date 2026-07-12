import { notFound } from "next/navigation";

import { getNounsBySet } from "@/lib/db/nouns";
import { LearnDeck } from "@/components/nouns/learn-deck";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const nouns = await getNounsBySet(setNumber);

  return <LearnDeck nouns={nouns} setNumber={setNumber} />;
}
