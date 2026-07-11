import { notFound } from "next/navigation";

import { getOtherWordsBySet } from "@/lib/db/other-words";
import { LearnDeck } from "@/components/other-words/learn-deck";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const words = getOtherWordsBySet(setNumber);

  return <LearnDeck words={words} setNumber={setNumber} />;
}
