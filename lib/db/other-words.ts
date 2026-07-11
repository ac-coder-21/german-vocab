import db from "@/lib/db";

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

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM other_words")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO other_words (german, english, set_number) VALUES (?, ?, 0)"
  );
  for (const word of DUMMY_SET_0) {
    insert.run(word.german, word.english);
  }
}

seedIfEmpty();

export function getOtherWordSets(): OtherWordSet[] {
  const rows = db
    .prepare(
      "SELECT set_number as setNumber, COUNT(*) as count FROM other_words GROUP BY set_number ORDER BY set_number"
    )
    .all() as OtherWordSet[];
  return rows.map((row) => ({ ...row }));
}

export function getOtherWordsBySet(setNumber: number): OtherWord[] {
  const rows = db
    .prepare("SELECT * FROM other_words WHERE set_number = ? ORDER BY id")
    .all(setNumber) as OtherWord[];
  return rows.map((row) => ({ ...row }));
}

export function getNextOtherWordSetNumber(): number {
  const { maxSet } = db
    .prepare("SELECT MAX(set_number) as maxSet FROM other_words")
    .get() as { maxSet: number | null };
  return maxSet === null ? 0 : maxSet + 1;
}

export function createOtherWord(input: {
  german: string;
  english: string;
  setNumber: number;
}): void {
  db.prepare(
    "INSERT INTO other_words (german, english, set_number) VALUES (?, ?, ?)"
  ).run(input.german, input.english, input.setNumber);
}

export function updateOtherWord(
  id: number,
  input: { german: string; english: string }
): void {
  db.prepare("UPDATE other_words SET german = ?, english = ? WHERE id = ?").run(
    input.german,
    input.english,
    id
  );
}

export function deleteOtherWord(id: number): void {
  db.prepare("DELETE FROM other_words WHERE id = ?").run(id);
}

export function deleteOtherWordSet(setNumber: number): void {
  db.prepare("DELETE FROM other_words WHERE set_number = ?").run(setNumber);
}
