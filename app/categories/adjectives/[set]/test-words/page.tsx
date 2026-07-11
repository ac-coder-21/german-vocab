import { notFound } from "next/navigation";

import { getAdjectivesBySet } from "@/lib/db/adjectives";
import { TestWordsDeck } from "@/components/adjectives/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const adjectives = getAdjectivesBySet(setNumber);

  return <TestWordsDeck adjectives={adjectives} setNumber={setNumber} />;
}
