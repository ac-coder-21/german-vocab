import { getNextSetNumber, getNounSets, getNounsBySet } from "@/lib/db/nouns";
import { ManageSets } from "@/components/nouns/manage-sets";

export default async function ManageNounsPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set } = await searchParams;
  const sets = await getNounSets();

  const parsedSet = set !== undefined ? Number(set) : sets[0]?.setNumber;
  const selectedSet =
    parsedSet !== undefined && Number.isInteger(parsedSet) ? parsedSet : undefined;

  const nouns = selectedSet !== undefined ? await getNounsBySet(selectedSet) : [];
  const nextSetNumber = await getNextSetNumber();

  return (
    <ManageSets
      sets={sets}
      selectedSet={selectedSet}
      nouns={nouns}
      nextSetNumber={nextSetNumber}
    />
  );
}
