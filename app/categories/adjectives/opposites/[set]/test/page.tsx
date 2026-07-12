import { notFound } from "next/navigation";

import { getOppositesBySets } from "@/lib/db/opposites";
import { parseSetNumbers } from "@/lib/parse-set-numbers";
import { OppositesTestDeck } from "@/components/adjectives/opposites/opposites-test-deck";

export default async function OppositesTestPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const setNumbers = parseSetNumbers(set);

  if (!setNumbers) notFound();

  const pairs = await getOppositesBySets(setNumbers);

  return <OppositesTestDeck pairs={pairs} setNumbers={setNumbers} />;
}
