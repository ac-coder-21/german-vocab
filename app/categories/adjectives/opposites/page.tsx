import { getOppositeSets } from "@/lib/db/opposites";
import { OppositesHome } from "@/components/adjectives/opposites/opposites-home";

export default function OppositesPage() {
  const sets = getOppositeSets();
  return <OppositesHome sets={sets} />;
}
