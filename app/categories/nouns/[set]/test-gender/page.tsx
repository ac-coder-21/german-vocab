import { notFound } from "next/navigation";

import { getNounsBySet } from "@/lib/db/nouns";
import { TestGenderDeck } from "@/components/nouns/test-gender-deck";

export default async function TestGenderPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const nouns = getNounsBySet(setNumber);

  return <TestGenderDeck nouns={nouns} setNumber={setNumber} />;
}
