import { notFound } from "next/navigation";

import { getVerbsBySet } from "@/lib/db/verbs";
import { LearnDeck } from "@/components/verbs/learn-deck";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const verbs = getVerbsBySet(setNumber);

  return <LearnDeck verbs={verbs} setNumber={setNumber} />;
}
