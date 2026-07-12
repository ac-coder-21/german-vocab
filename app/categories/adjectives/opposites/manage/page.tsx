import {
  getNextOppositeSetNumber,
  getOppositeSets,
  getOppositesBySet,
} from "@/lib/db/opposites";
import { ManageOppositeSets } from "@/components/adjectives/opposites/manage-opposite-sets";

export default async function ManageOppositesPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set } = await searchParams;
  const sets = await getOppositeSets();

  const parsedSet = set !== undefined ? Number(set) : sets[0]?.setNumber;
  const selectedSet =
    parsedSet !== undefined && Number.isInteger(parsedSet) ? parsedSet : undefined;

  const opposites = selectedSet !== undefined ? await getOppositesBySet(selectedSet) : [];
  const nextSetNumber = await getNextOppositeSetNumber();

  return (
    <ManageOppositeSets
      sets={sets}
      selectedSet={selectedSet}
      opposites={opposites}
      nextSetNumber={nextSetNumber}
    />
  );
}
