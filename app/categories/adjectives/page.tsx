import { getAdjectiveSets } from "@/lib/db/adjectives";
import { AdjectivesHome } from "@/components/adjectives/adjectives-home";

export default function AdjectivesPage() {
  const sets = getAdjectiveSets();
  return <AdjectivesHome sets={sets} />;
}
