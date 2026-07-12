import { getVerbSets } from "@/lib/db/verbs";
import { VerbsHome } from "@/components/verbs/verbs-home";

export default async function VerbsPage() {
  const sets = await getVerbSets();
  return <VerbsHome sets={sets} />;
}
