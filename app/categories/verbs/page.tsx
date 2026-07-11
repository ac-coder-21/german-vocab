import { getVerbSets } from "@/lib/db/verbs";
import { VerbsHome } from "@/components/verbs/verbs-home";

export default function VerbsPage() {
  const sets = getVerbSets();
  return <VerbsHome sets={sets} />;
}
