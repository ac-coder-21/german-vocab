import db from "@/lib/db";

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

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM opposites")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO opposites (word, opposite, set_number) VALUES (?, ?, 0)"
  );
  for (const pair of DUMMY_SET_0) {
    insert.run(pair.word, pair.opposite);
  }
}

seedIfEmpty();

export function getOppositeSets(): OppositeSet[] {
  const rows = db
    .prepare(
      "SELECT set_number as setNumber, COUNT(*) as count FROM opposites GROUP BY set_number ORDER BY set_number"
    )
    .all() as OppositeSet[];
  return rows.map((row) => ({ ...row }));
}

export function getOppositesBySet(setNumber: number): Opposite[] {
  const rows = db
    .prepare("SELECT * FROM opposites WHERE set_number = ? ORDER BY id")
    .all(setNumber) as Opposite[];
  return rows.map((row) => ({ ...row }));
}

export function getNextOppositeSetNumber(): number {
  const { maxSet } = db
    .prepare("SELECT MAX(set_number) as maxSet FROM opposites")
    .get() as { maxSet: number | null };
  return maxSet === null ? 0 : maxSet + 1;
}

export function createOpposite(input: {
  word: string;
  opposite: string;
  setNumber: number;
}): void {
  db.prepare(
    "INSERT INTO opposites (word, opposite, set_number) VALUES (?, ?, ?)"
  ).run(input.word, input.opposite, input.setNumber);
}

export function updateOpposite(
  id: number,
  input: { word: string; opposite: string }
): void {
  db.prepare("UPDATE opposites SET word = ?, opposite = ? WHERE id = ?").run(
    input.word,
    input.opposite,
    id
  );
}

export function deleteOpposite(id: number): void {
  db.prepare("DELETE FROM opposites WHERE id = ?").run(id);
}

export function deleteOppositeSet(setNumber: number): void {
  db.prepare("DELETE FROM opposites WHERE set_number = ?").run(setNumber);
}
