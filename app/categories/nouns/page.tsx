import { getNounSets } from "@/lib/db/nouns";
import { NounsHome } from "@/components/nouns/nouns-home";

export default function NounsPage() {
  const sets = getNounSets();
  return <NounsHome sets={sets} />;
}
