import { notFound } from "next/navigation";

import { getVerbsBySet } from "@/lib/db/verbs";
import { TestWordsDeck } from "@/components/verbs/test-words-deck";

export default async function TestWordsPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const verbs = await getVerbsBySet(setNumber);

  return <TestWordsDeck verbs={verbs} setNumber={setNumber} />;
}
