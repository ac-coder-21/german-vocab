import { notFound } from "next/navigation";

import { getOtherWordsBySet } from "@/lib/db/other-words";
import { TestWordsDeck } from "@/components/other-words/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const words = getOtherWordsBySet(setNumber);

  return <TestWordsDeck words={words} setNumber={setNumber} />;
}
