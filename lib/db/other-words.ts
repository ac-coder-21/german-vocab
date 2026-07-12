import { query, ready } from "@/lib/db";

export type OtherWord = {
  id: number;
  german: string;
  english: string;
  set_number: number;
};

export type OtherWordSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: Omit<OtherWord, "id" | "set_number">[] = [
  { german: "und", english: "and" },
  { german: "oder", english: "or" },
  { german: "aber", english: "but" },
  { german: "mit", english: "with" },
  { german: "ohne", english: "without" },
  { german: "heute", english: "today" },
  { german: "morgen", english: "tomorrow" },
  { german: "gestern", english: "yesterday" },
  { german: "sehr", english: "very" },
  { german: "immer", english: "always" },
  { german: "nie", english: "never" },
  { german: "hier", english: "here" },
  { german: "dort", english: "there" },
  { german: "schnell", english: "quickly" },
  { german: "vielleicht", english: "maybe" },
];

async function seedIfEmpty() {
  await ready();

  const [{ count }] = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM other_words"
  );
  if (Number(count) > 0) return;

  for (const word of DUMMY_SET_0) {
    await query(
      "INSERT INTO other_words (german, english, set_number) VALUES ($1, $2, 0)",
      [word.german, word.english]
    );
  }
}

const seeded = seedIfEmpty();

export async function getOtherWordSets(): Promise<OtherWordSet[]> {
  await seeded;
  const rows = await query<{ setNumber: number; count: string }>(
    `SELECT set_number as "setNumber", COUNT(*) as count FROM other_words
     GROUP BY set_number ORDER BY set_number`
  );
  return rows.map((row) => ({ setNumber: row.setNumber, count: Number(row.count) }));
}

export async function getOtherWordsBySet(setNumber: number): Promise<OtherWord[]> {
  await seeded;
  return query<OtherWord>(
    "SELECT * FROM other_words WHERE set_number = $1 ORDER BY id",
    [setNumber]
  );
}

export async function getNextOtherWordSetNumber(): Promise<number> {
  await seeded;
  const [{ maxSet }] = await query<{ maxSet: number | null }>(
    'SELECT MAX(set_number) as "maxSet" FROM other_words'
  );
  return maxSet === null ? 0 : maxSet + 1;
}

export async function createOtherWord(input: {
  german: string;
  english: string;
  setNumber: number;
}): Promise<void> {
  await seeded;
  await query(
    "INSERT INTO other_words (german, english, set_number) VALUES ($1, $2, $3)",
    [input.german, input.english, input.setNumber]
  );
}

export async function updateOtherWord(
  id: number,
  input: { german: string; english: string }
): Promise<void> {
  await seeded;
  await query("UPDATE other_words SET german = $1, english = $2 WHERE id = $3", [
    input.german,
    input.english,
    id,
  ]);
}

export async function deleteOtherWord(id: number): Promise<void> {
  await seeded;
  await query("DELETE FROM other_words WHERE id = $1", [id]);
}

export async function deleteOtherWordSet(setNumber: number): Promise<void> {
  await seeded;
  await query("DELETE FROM other_words WHERE set_number = $1", [setNumber]);
}
