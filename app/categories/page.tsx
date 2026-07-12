import { CategoriesGrid } from "@/components/categories-grid";
import { getCategoryCounts } from "@/lib/db/stats";

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();
  return <CategoriesGrid counts={counts} />;
}
