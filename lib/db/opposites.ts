import { query, ready } from "@/lib/db";

export type Opposite = {
  id: number;
  word: string;
  opposite: string;
  set_number: number;
};

export type OppositeSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: Omit<Opposite, "id" | "set_number">[] = [
  { word: "groß", opposite: "klein" },
  { word: "schnell", opposite: "langsam" },
  { word: "gut", opposite: "schlecht" },
  { word: "alt", opposite: "neu" },
  { word: "warm", opposite: "kalt" },
  { word: "hell", opposite: "dunkel" },
  { word: "laut", opposite: "leise" },
  { word: "stark", opposite: "schwach" },
  { word: "hoch", opposite: "niedrig" },
  { word: "breit", opposite: "schmal" },
];

async function seedIfEmpty() {
  await ready();

  const [{ count }] = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM opposites"
  );
  if (Number(count) > 0) return;

  for (const pair of DUMMY_SET_0) {
    await query(
      "INSERT INTO opposites (word, opposite, set_number) VALUES ($1, $2, 0)",
      [pair.word, pair.opposite]
    );
  }
}

const seeded = seedIfEmpty();

export async function getOppositeSets(): Promise<OppositeSet[]> {
  await seeded;
  const rows = await query<{ setNumber: number; count: string }>(
    `SELECT set_number as "setNumber", COUNT(*) as count FROM opposites
     GROUP BY set_number ORDER BY set_number`
  );
  return rows.map((row) => ({ setNumber: row.setNumber, count: Number(row.count) }));
}

export async function getOppositesBySet(setNumber: number): Promise<Opposite[]> {
  await seeded;
  return query<Opposite>("SELECT * FROM opposites WHERE set_number = $1 ORDER BY id", [
    setNumber,
  ]);
}

export async function getNextOppositeSetNumber(): Promise<number> {
  await seeded;
  const [{ maxSet }] = await query<{ maxSet: number | null }>(
    'SELECT MAX(set_number) as "maxSet" FROM opposites'
  );
  return maxSet === null ? 0 : maxSet + 1;
}

export async function createOpposite(input: {
  word: string;
  opposite: string;
  setNumber: number;
}): Promise<void> {
  await seeded;
  await query(
    "INSERT INTO opposites (word, opposite, set_number) VALUES ($1, $2, $3)",
    [input.word, input.opposite, input.setNumber]
  );
}

export async function updateOpposite(
  id: number,
  input: { word: string; opposite: string }
): Promise<void> {
  await seeded;
  await query("UPDATE opposites SET word = $1, opposite = $2 WHERE id = $3", [
    input.word,
    input.opposite,
    id,
  ]);
}

export async function deleteOpposite(id: number): Promise<void> {
  await seeded;
  await query("DELETE FROM opposites WHERE id = $1", [id]);
}

export async function deleteOppositeSet(setNumber: number): Promise<void> {
  await seeded;
  await query("DELETE FROM opposites WHERE set_number = $1", [setNumber]);
}
