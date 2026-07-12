import { query, ready } from "@/lib/db";

export type CategoryCounts = {
  nouns: number;
  verbs: number;
  adjectives: number;
  otherWords: number;
};

// Opposites is a sub-feature of adjectives with its own separate table —
// deliberately excluded from these counts.
export async function getCategoryCounts(): Promise<CategoryCounts> {
  await ready();

  const [nouns, verbs, adjectives, otherWords] = await Promise.all([
    query<{ count: string }>("SELECT COUNT(*) as count FROM nouns"),
    query<{ count: string }>("SELECT COUNT(*) as count FROM verbs"),
    query<{ count: string }>("SELECT COUNT(*) as count FROM adjectives"),
    query<{ count: string }>("SELECT COUNT(*) as count FROM other_words"),
  ]);

  return {
    nouns: Number(nouns[0].count),
    verbs: Number(verbs[0].count),
    adjectives: Number(adjectives[0].count),
    otherWords: Number(otherWords[0].count),
  };
}
