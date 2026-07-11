import { getOtherWordSets } from "@/lib/db/other-words";
import { OtherWordsHome } from "@/components/other-words/other-words-home";

export default function OtherWordsPage() {
  const sets = getOtherWordSets();
  return <OtherWordsHome sets={sets} />;
}
