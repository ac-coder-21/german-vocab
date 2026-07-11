import db from "@/lib/db";

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

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM nouns")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO nouns (german, english, artikel, set_number) VALUES (?, ?, ?, 0)"
  );
  for (const noun of DUMMY_SET_0) {
    insert.run(noun.german, noun.english, noun.artikel);
  }
}

seedIfEmpty();

export function getNounSets(): NounSet[] {
  const rows = db
    .prepare(
      "SELECT set_number as setNumber, COUNT(*) as count FROM nouns GROUP BY set_number ORDER BY set_number"
    )
    .all() as NounSet[];
  return rows.map((row) => ({ ...row }));
}

export function getNounsBySet(setNumber: number): Noun[] {
  const rows = db
    .prepare("SELECT * FROM nouns WHERE set_number = ? ORDER BY id")
    .all(setNumber) as Noun[];
  return rows.map((row) => ({ ...row }));
}

export function getNextSetNumber(): number {
  const { maxSet } = db
    .prepare("SELECT MAX(set_number) as maxSet FROM nouns")
    .get() as { maxSet: number | null };
  return maxSet === null ? 0 : maxSet + 1;
}

export function createNoun(input: {
  german: string;
  english: string;
  artikel: Artikel;
  setNumber: number;
}): void {
  db.prepare(
    "INSERT INTO nouns (german, english, artikel, set_number) VALUES (?, ?, ?, ?)"
  ).run(input.german, input.english, input.artikel, input.setNumber);
}

export function updateNoun(
  id: number,
  input: { german: string; english: string; artikel: Artikel }
): void {
  db.prepare(
    "UPDATE nouns SET german = ?, english = ?, artikel = ? WHERE id = ?"
  ).run(input.german, input.english, input.artikel, id);
}

export function deleteNoun(id: number): void {
  db.prepare("DELETE FROM nouns WHERE id = ?").run(id);
}

export function deleteSet(setNumber: number): void {
  db.prepare("DELETE FROM nouns WHERE set_number = ?").run(setNumber);
}
