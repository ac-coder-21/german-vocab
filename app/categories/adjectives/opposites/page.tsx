import { getOppositeSets } from "@/lib/db/opposites";
import { OppositesHome } from "@/components/adjectives/opposites/opposites-home";

export default async function OppositesPage() {
  const sets = await getOppositeSets();
  return <OppositesHome sets={sets} />;
}
