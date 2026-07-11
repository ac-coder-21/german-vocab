import {
  getAdjectiveSets,
  getAdjectivesBySet,
  getNextAdjectiveSetNumber,
} from "@/lib/db/adjectives";
import { ManageAdjectiveSets } from "@/components/adjectives/manage-adjective-sets";

export default async function ManageAdjectivesPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set } = await searchParams;
  const sets = getAdjectiveSets();

  const parsedSet = set !== undefined ? Number(set) : sets[0]?.setNumber;
  const selectedSet =
    parsedSet !== undefined && Number.isInteger(parsedSet) ? parsedSet : undefined;

  const adjectives = selectedSet !== undefined ? getAdjectivesBySet(selectedSet) : [];
  const nextSetNumber = getNextAdjectiveSetNumber();

  return (
    <ManageAdjectiveSets
      sets={sets}
      selectedSet={selectedSet}
      adjectives={adjectives}
      nextSetNumber={nextSetNumber}
    />
  );
}
