import { notFound } from "next/navigation";

import { getAdjectivesBySet } from "@/lib/db/adjectives";
import { LearnDeck } from "@/components/adjectives/learn-deck";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const adjectives = getAdjectivesBySet(setNumber);

  return <LearnDeck adjectives={adjectives} setNumber={setNumber} />;
}
