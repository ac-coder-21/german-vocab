import { getAdjectiveSets } from "@/lib/db/adjectives";
import { AdjectivesHome } from "@/components/adjectives/adjectives-home";

export default async function AdjectivesPage() {
  const sets = await getAdjectiveSets();
  return <AdjectivesHome sets={sets} />;
}
