import {
  getNextVerbSetNumber,
  getVerbSets,
  getVerbsBySet,
} from "@/lib/db/verbs";
import { ManageVerbSets } from "@/components/verbs/manage-verb-sets";

export default async function ManageVerbsPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set } = await searchParams;
  const sets = await getVerbSets();

  const parsedSet = set !== undefined ? Number(set) : sets[0]?.setNumber;
  const selectedSet =
    parsedSet !== undefined && Number.isInteger(parsedSet) ? parsedSet : undefined;

  const verbs = selectedSet !== undefined ? await getVerbsBySet(selectedSet) : [];
  const nextSetNumber = await getNextVerbSetNumber();

  return (
    <ManageVerbSets
      sets={sets}
      selectedSet={selectedSet}
      verbs={verbs}
      nextSetNumber={nextSetNumber}
    />
  );
}
