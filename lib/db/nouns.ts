import { query, ready } from "@/lib/db";

export type Artikel = "der" | "die" | "das";

export type Noun = {
  id: number;
  german: string;
  english: string;
  artikel: Artikel;
  set_number: number;
};

export type NounSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: Omit<Noun, "id" | "set_number">[] = [
  { german: "Tisch", english: "table", artikel: "der" },
  { german: "Lampe", english: "lamp", artikel: "die" },
  { german: "Buch", english: "book", artikel: "das" },
  { german: "Hund", english: "dog", artikel: "der" },
  { german: "Katze", english: "cat", artikel: "die" },
  { german: "Auto", english: "car", artikel: "das" },
  { german: "Apfel", english: "apple", artikel: "der" },
  { german: "Schule", english: "school", artikel: "die" },
  { german: "Fenster", english: "window", artikel: "das" },
  { german: "Freund", english: "friend", artikel: "der" },
  { german: "Zeit", english: "time", artikel: "die" },
  { german: "Wasser", english: "water", artikel: "das" },
  { german: "Baum", english: "tree", artikel: "der" },
  { german: "Straße", english: "street", artikel: "die" },
  { german: "Kind", english: "child", artikel: "das" },
];

async function seedIfEmpty() {
  await ready();

  const [{ count }] = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM nouns"
  );
  if (Number(count) > 0) return;

  for (const noun of DUMMY_SET_0) {
    await query(
      "INSERT INTO nouns (german, english, artikel, set_number) VALUES ($1, $2, $3, 0)",
      [noun.german, noun.english, noun.artikel]
    );
  }
}

const seeded = seedIfEmpty();

export async function getNounSets(): Promise<NounSet[]> {
  await seeded;
  const rows = await query<{ setNumber: number; count: string }>(
    `SELECT set_number as "setNumber", COUNT(*) as count FROM nouns
     GROUP BY set_number ORDER BY set_number`
  );
  return rows.map((row) => ({ setNumber: row.setNumber, count: Number(row.count) }));
}

export async function getNounsBySet(setNumber: number): Promise<Noun[]> {
  await seeded;
  return query<Noun>("SELECT * FROM nouns WHERE set_number = $1 ORDER BY id", [
    setNumber,
  ]);
}

export async function getNextSetNumber(): Promise<number> {
  await seeded;
  const [{ maxSet }] = await query<{ maxSet: number | null }>(
    'SELECT MAX(set_number) as "maxSet" FROM nouns'
  );
  return maxSet === null ? 0 : maxSet + 1;
}

export async function createNoun(input: {
  german: string;
  english: string;
  artikel: Artikel;
  setNumber: number;
}): Promise<void> {
  await seeded;
  await query(
    "INSERT INTO nouns (german, english, artikel, set_number) VALUES ($1, $2, $3, $4)",
    [input.german, input.english, input.artikel, input.setNumber]
  );
}

export async function updateNoun(
  id: number,
  input: { german: string; english: string; artikel: Artikel }
): Promise<void> {
  await seeded;
  await query("UPDATE nouns SET german = $1, english = $2, artikel = $3 WHERE id = $4", [
    input.german,
    input.english,
    input.artikel,
    id,
  ]);
}

export async function deleteNoun(id: number): Promise<void> {
  await seeded;
  await query("DELETE FROM nouns WHERE id = $1", [id]);
}

export async function deleteSet(setNumber: number): Promise<void> {
  await seeded;
  await query("DELETE FROM nouns WHERE set_number = $1", [setNumber]);
}
