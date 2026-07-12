import { query, ready } from "@/lib/db";

export type Adjective = {
  id: number;
  german: string;
  english: string;
  set_number: number;
};

export type AdjectiveSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: Omit<Adjective, "id" | "set_number">[] = [
  { german: "groß", english: "big" },
  { german: "klein", english: "small" },
  { german: "schnell", english: "fast" },
  { german: "langsam", english: "slow" },
  { german: "gut", english: "good" },
  { german: "schlecht", english: "bad" },
  { german: "neu", english: "new" },
  { german: "alt", english: "old" },
  { german: "schön", english: "beautiful" },
  { german: "hässlich", english: "ugly" },
  { german: "warm", english: "warm" },
  { german: "kalt", english: "cold" },
  { german: "einfach", english: "easy" },
  { german: "schwierig", english: "difficult" },
  { german: "glücklich", english: "happy" },
];

async function seedIfEmpty() {
  await ready();

  const [{ count }] = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM adjectives"
  );
  if (Number(count) > 0) return;

  for (const adjective of DUMMY_SET_0) {
    await query(
      "INSERT INTO adjectives (german, english, set_number) VALUES ($1, $2, 0)",
      [adjective.german, adjective.english]
    );
  }
}

const seeded = seedIfEmpty();

export async function getAdjectiveSets(): Promise<AdjectiveSet[]> {
  await seeded;
  const rows = await query<{ setNumber: number; count: string }>(
    `SELECT set_number as "setNumber", COUNT(*) as count FROM adjectives
     GROUP BY set_number ORDER BY set_number`
  );
  return rows.map((row) => ({ setNumber: row.setNumber, count: Number(row.count) }));
}

export async function getAdjectivesBySet(setNumber: number): Promise<Adjective[]> {
  await seeded;
  return query<Adjective>(
    "SELECT * FROM adjectives WHERE set_number = $1 ORDER BY id",
    [setNumber]
  );
}

export async function getNextAdjectiveSetNumber(): Promise<number> {
  await seeded;
  const [{ maxSet }] = await query<{ maxSet: number | null }>(
    'SELECT MAX(set_number) as "maxSet" FROM adjectives'
  );
  return maxSet === null ? 0 : maxSet + 1;
}

export async function createAdjective(input: {
  german: string;
  english: string;
  setNumber: number;
}): Promise<void> {
  await seeded;
  await query(
    "INSERT INTO adjectives (german, english, set_number) VALUES ($1, $2, $3)",
    [input.german, input.english, input.setNumber]
  );
}

export async function updateAdjective(
  id: number,
  input: { german: string; english: string }
): Promise<void> {
  await seeded;
  await query("UPDATE adjectives SET german = $1, english = $2 WHERE id = $3", [
    input.german,
    input.english,
    id,
  ]);
}

export async function deleteAdjective(id: number): Promise<void> {
  await seeded;
  await query("DELETE FROM adjectives WHERE id = $1", [id]);
}

export async function deleteAdjectiveSet(setNumber: number): Promise<void> {
  await seeded;
  await query("DELETE FROM adjectives WHERE set_number = $1", [setNumber]);
}
