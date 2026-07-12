import { notFound } from "next/navigation";

import { getOppositesBySet } from "@/lib/db/opposites";
import { OppositesTestDeck } from "@/components/adjectives/opposites/opposites-test-deck";

export default async function OppositesTestPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumber = Number(set);

  if (!Number.isInteger(setNumber)) notFound();

  const pairs = await getOppositesBySet(setNumber);

  return <OppositesTestDeck pairs={pairs} setNumber={setNumber} />;
}
