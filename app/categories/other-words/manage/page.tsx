import {
  getNextOtherWordSetNumber,
  getOtherWordSets,
  getOtherWordsBySet,
} from "@/lib/db/other-words";
import { ManageOtherWordSets } from "@/components/other-words/manage-other-word-sets";

export default async function ManageOtherWordsPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const { set } = await searchParams;
  const sets = await getOtherWordSets();

  const parsedSet = set !== undefined ? Number(set) : sets[0]?.setNumber;
  const selectedSet =
    parsedSet !== undefined && Number.isInteger(parsedSet) ? parsedSet : undefined;

  const words = selectedSet !== undefined ? await getOtherWordsBySet(selectedSet) : [];
  const nextSetNumber = await getNextOtherWordSetNumber();

  return (
    <ManageOtherWordSets
      sets={sets}
      selectedSet={selectedSet}
      words={words}
      nextSetNumber={nextSetNumber}
    />
  );
}
