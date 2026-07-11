import db from "@/lib/db";
import type { Conjugation } from "@/lib/verb-pronouns";

export type Verb = {
  id: number;
  german: string;
  english: string;
  set_number: number;
  ich: string | null;
  du: string | null;
  er_sie_es: string | null;
  wir: string | null;
  ihr: string | null;
  sie_formal: string | null;
};

export type VerbSet = {
  setNumber: number;
  count: number;
};

const DUMMY_SET_0: ({ german: string; english: string } & Conjugation)[] = [
  { german: "sein", english: "to be", ich: "bin", du: "bist", er_sie_es: "ist", wir: "sind", ihr: "seid", sie_formal: "sind" },
  { german: "haben", english: "to have", ich: "habe", du: "hast", er_sie_es: "hat", wir: "haben", ihr: "habt", sie_formal: "haben" },
  { german: "werden", english: "to become", ich: "werde", du: "wirst", er_sie_es: "wird", wir: "werden", ihr: "werdet", sie_formal: "werden" },
  { german: "gehen", english: "to go", ich: "gehe", du: "gehst", er_sie_es: "geht", wir: "gehen", ihr: "geht", sie_formal: "gehen" },
  { german: "kommen", english: "to come", ich: "komme", du: "kommst", er_sie_es: "kommt", wir: "kommen", ihr: "kommt", sie_formal: "kommen" },
  { german: "machen", english: "to make/do", ich: "mache", du: "machst", er_sie_es: "macht", wir: "machen", ihr: "macht", sie_formal: "machen" },
  { german: "sagen", english: "to say", ich: "sage", du: "sagst", er_sie_es: "sagt", wir: "sagen", ihr: "sagt", sie_formal: "sagen" },
  { german: "sehen", english: "to see", ich: "sehe", du: "siehst", er_sie_es: "sieht", wir: "sehen", ihr: "seht", sie_formal: "sehen" },
  { german: "wissen", english: "to know", ich: "weiß", du: "weißt", er_sie_es: "weiß", wir: "wissen", ihr: "wisst", sie_formal: "wissen" },
  { german: "können", english: "to be able to", ich: "kann", du: "kannst", er_sie_es: "kann", wir: "können", ihr: "könnt", sie_formal: "können" },
  { german: "essen", english: "to eat", ich: "esse", du: "isst", er_sie_es: "isst", wir: "essen", ihr: "esst", sie_formal: "essen" },
  { german: "trinken", english: "to drink", ich: "trinke", du: "trinkst", er_sie_es: "trinkt", wir: "trinken", ihr: "trinkt", sie_formal: "trinken" },
  { german: "arbeiten", english: "to work", ich: "arbeite", du: "arbeitest", er_sie_es: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie_formal: "arbeiten" },
  { german: "spielen", english: "to play", ich: "spiele", du: "spielst", er_sie_es: "spielt", wir: "spielen", ihr: "spielt", sie_formal: "spielen" },
  { german: "schlafen", english: "to sleep", ich: "schlafe", du: "schläfst", er_sie_es: "schläft", wir: "schlafen", ihr: "schlaft", sie_formal: "schlafen" },
];

function seedIfEmpty() {
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM verbs")
    .get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(
    `INSERT INTO verbs (german, english, set_number, ich, du, er_sie_es, wir, ihr, sie_formal)
     VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?)`
  );
  for (const verb of DUMMY_SET_0) {
    insert.run(
      verb.german,
      verb.english,
      verb.ich,
      verb.du,
      verb.er_sie_es,
      verb.wir,
      verb.ihr,
      verb.sie_formal
    );
  }
}

// Backfills conjugations for the known dummy verbs onto any row that's
// missing them — covers people who already had Set 0 seeded before
// conjugation columns existed. Never touches rows that already have a
// value, so user edits are safe.
function backfillDummyConjugations() {
  const rows = db
    .prepare("SELECT id, german FROM verbs WHERE ich IS NULL")
    .all() as { id: number; german: string }[];
  if (rows.length === 0) return;

  const known = new Map(DUMMY_SET_0.map((v) => [v.german, v]));
  const update = db.prepare(
    `UPDATE verbs SET ich = ?, du = ?, er_sie_es = ?, wir = ?, ihr = ?, sie_formal = ?
     WHERE id = ?`
  );
  for (const row of rows) {
    const conjugation = known.get(row.german);
    if (!conjugation) continue;
    update.run(
      conjugation.ich,
      conjugation.du,
      conjugation.er_sie_es,
      conjugation.wir,
      conjugation.ihr,
      conjugation.sie_formal,
      row.id
    );
  }
}

seedIfEmpty();
backfillDummyConjugations();

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
  input: {
    german: string;
    english: string;
    ich: string;
    du: string;
    er_sie_es: string;
    wir: string;
    ihr: string;
    sie_formal: string;
  }
): void {
  db.prepare(
    `UPDATE verbs SET german = ?, english = ?, ich = ?, du = ?, er_sie_es = ?,
     wir = ?, ihr = ?, sie_formal = ? WHERE id = ?`
  ).run(
    input.german,
    input.english,
    input.ich || null,
    input.du || null,
    input.er_sie_es || null,
    input.wir || null,
    input.ihr || null,
    input.sie_formal || null,
    id
  );
}

export function deleteVerb(id: number): void {
  db.prepare("DELETE FROM verbs WHERE id = ?").run(id);
}

export function deleteVerbSet(setNumber: number): void {
  db.prepare("DELETE FROM verbs WHERE set_number = ?").run(setNumber);
}
