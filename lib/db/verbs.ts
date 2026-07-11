import db from "@/lib/db";

export type Verb = {
  id: number;
  german: string;
  english: string;
  set_number: number;
};

export type VerbSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: Omit<Verb, "id" | "set_number">[] = [
  { german: "sein", english: "to be" },
  { german: "haben", english: "to have" },
  { german: "werden", english: "to become" },
  { german: "gehen", english: "to go" },
  { german: "kommen", english: "to come" },
  { german: "machen", english: "to make/do" },
  { german: "sagen", english: "to say" },
  { german: "sehen", english: "to see" },
  { german: "wissen", english: "to know" },
  { german: "können", english: "to be able to" },
  { german: "essen", english: "to eat" },
  { german: "trinken", english: "to drink" },
  { german: "arbeiten", english: "to work" },
  { german: "spielen", english: "to play" },
  { german: "schlafen", english: "to sleep" },
];

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM verbs")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO verbs (german, english, set_number) VALUES (?, ?, 0)"
  );
  for (const verb of DUMMY_SET_0) {
    insert.run(verb.german, verb.english);
  }
}

seedIfEmpty();

export function getVerbSets(): VerbSet[] {
  const rows = db
    .prepare(
      "SELECT set_number as setNumber, COUNT(*) as count FROM verbs GROUP BY set_number ORDER BY set_number"
    )
    .all() as VerbSet[];
  return rows.map((row) => ({ ...row }));
}

export function getVerbsBySet(setNumber: number): Verb[] {
  const rows = db
    .prepare("SELECT * FROM verbs WHERE set_number = ? ORDER BY id")
    .all(setNumber) as Verb[];
  return rows.map((row) => ({ ...row }));
}

export function getNextVerbSetNumber(): number {
  const { maxSet } = db
    .prepare("SELECT MAX(set_number) as maxSet FROM verbs")
    .get() as { maxSet: number | null };
  return maxSet === null ? 0 : maxSet + 1;
}

export function createVerb(input: {
  german: string;
  english: string;
  setNumber: number;
}): void {
  db.prepare(
    "INSERT INTO verbs (german, english, set_number) VALUES (?, ?, ?)"
  ).run(input.german, input.english, input.setNumber);
}

export function updateVerb(
  id: number,
  input: { german: string; english: string }
): void {
  db.prepare("UPDATE verbs SET german = ?, english = ? WHERE id = ?").run(
    input.german,
    input.english,
    id
  );
}

export function deleteVerb(id: number): void {
  db.prepare("DELETE FROM verbs WHERE id = ?").run(id);
}

export function deleteVerbSet(setNumber: number): void {
  db.prepare("DELETE FROM verbs WHERE set_number = ?").run(setNumber);
}
