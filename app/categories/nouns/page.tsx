import { getNounSets } from "@/lib/db/nouns";
import { NounsHome } from "@/components/nouns/nouns-home";

export default async function NounsPage() {
  const sets = await getNounSets();
  return <NounsHome sets={sets} />;
}
