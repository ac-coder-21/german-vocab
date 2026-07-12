import { getOtherWordSets } from "@/lib/db/other-words";
import { OtherWordsHome } from "@/components/other-words/other-words-home";

export default async function OtherWordsPage() {
  const sets = await getOtherWordSets();
  return <OtherWordsHome sets={sets} />;
}
