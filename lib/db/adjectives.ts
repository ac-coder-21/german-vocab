import db from "@/lib/db";

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

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM adjectives")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO adjectives (german, english, set_number) VALUES (?, ?, 0)"
  );
  for (const adjective of DUMMY_SET_0) {
    insert.run(adjective.german, adjective.english);
  }
}

seedIfEmpty();

export function getAdjectiveSets(): AdjectiveSet[] {
  const rows = db
    .prepare(
      "SELECT set_number as setNumber, COUNT(*) as count FROM adjectives GROUP BY set_number ORDER BY set_number"
    )
    .all() as AdjectiveSet[];
  return rows.map((row) => ({ ...row }));
}

export function getAdjectivesBySet(setNumber: number): Adjective[] {
  const rows = db
    .prepare("SELECT * FROM adjectives WHERE set_number = ? ORDER BY id")
    .all(setNumber) as Adjective[];
  return rows.map((row) => ({ ...row }));
}

export function getNextAdjectiveSetNumber(): number {
  const { maxSet } = db
    .prepare("SELECT MAX(set_number) as maxSet FROM adjectives")
    .get() as { maxSet: number | null };
  return maxSet === null ? 0 : maxSet + 1;
}

export function createAdjective(input: {
  german: string;
  english: string;
  setNumber: number;
}): void {
  db.prepare(
    "INSERT INTO adjectives (german, english, set_number) VALUES (?, ?, ?)"
  ).run(input.german, input.english, input.setNumber);
}

export function updateAdjective(
  id: number,
  input: { german: string; english: string }
): void {
  db.prepare("UPDATE adjectives SET german = ?, english = ? WHERE id = ?").run(
    input.german,
    input.english,
    id
  );
}

export function deleteAdjective(id: number): void {
  db.prepare("DELETE FROM adjectives WHERE id = ?").run(id);
}

export function deleteAdjectiveSet(setNumber: number): void {
  db.prepare("DELETE FROM adjectives WHERE set_number = ?").run(setNumber);
}
