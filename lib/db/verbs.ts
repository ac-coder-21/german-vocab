import { query, ready } from "@/lib/db";
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

async function seedIfEmpty() {
  await ready();

  const [{ count }] = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM verbs"
  );
  if (Number(count) > 0) return;

  for (const verb of DUMMY_SET_0) {
    await query(
      `INSERT INTO verbs (german, english, set_number, ich, du, er_sie_es, wir, ihr, sie_formal)
       VALUES ($1, $2, 0, $3, $4, $5, $6, $7, $8)`,
      [
        verb.german,
        verb.english,
        verb.ich,
        verb.du,
        verb.er_sie_es,
        verb.wir,
        verb.ihr,
        verb.sie_formal,
      ]
    );
  }
}

// Backfills conjugations for the known dummy verbs onto any row that's
// missing them — covers people who already had Set 0 seeded before
// conjugation columns existed. Never touches rows that already have a
// value, so user edits are safe.
async function backfillDummyConjugations() {
  await ready();

  const rows = await query<{ id: number; german: string }>(
    "SELECT id, german FROM verbs WHERE ich IS NULL"
  );
  if (rows.length === 0) return;

  const known = new Map(DUMMY_SET_0.map((v) => [v.german, v]));
  for (const row of rows) {
    const conjugation = known.get(row.german);
    if (!conjugation) continue;
    await query(
      `UPDATE verbs SET ich = $1, du = $2, er_sie_es = $3, wir = $4, ihr = $5, sie_formal = $6
       WHERE id = $7`,
      [
        conjugation.ich,
        conjugation.du,
        conjugation.er_sie_es,
        conjugation.wir,
        conjugation.ihr,
        conjugation.sie_formal,
        row.id,
      ]
    );
  }
}

const seeded = seedIfEmpty().then(() => backfillDummyConjugations());

export async function getVerbSets(): Promise<VerbSet[]> {
  await seeded;
  const rows = await query<{ setNumber: number; count: string }>(
    `SELECT set_number as "setNumber", COUNT(*) as count FROM verbs
     GROUP BY set_number ORDER BY set_number`
  );
  return rows.map((row) => ({ setNumber: row.setNumber, count: Number(row.count) }));
}

export async function getVerbsBySet(setNumber: number): Promise<Verb[]> {
  await seeded;
  return query<Verb>("SELECT * FROM verbs WHERE set_number = $1 ORDER BY id", [
    setNumber,
  ]);
}

export async function getVerbsBySets(setNumbers: number[]): Promise<Verb[]> {
  await seeded;
  return query<Verb>(
    "SELECT * FROM verbs WHERE set_number = ANY($1) ORDER BY set_number, id",
    [setNumbers]
  );
}

export async function getNextVerbSetNumber(): Promise<number> {
  await seeded;
  const [{ maxSet }] = await query<{ maxSet: number | null }>(
    'SELECT MAX(set_number) as "maxSet" FROM verbs'
  );
  return maxSet === null ? 0 : maxSet + 1;
}

export async function createVerb(input: {
  german: string;
  english: string;
  setNumber: number;
}): Promise<void> {
  await seeded;
  await query("INSERT INTO verbs (german, english, set_number) VALUES ($1, $2, $3)", [
    input.german,
    input.english,
    input.setNumber,
  ]);
}

export async function updateVerb(
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
): Promise<void> {
  await seeded;
  await query(
    `UPDATE verbs SET german = $1, english = $2, ich = $3, du = $4, er_sie_es = $5,
     wir = $6, ihr = $7, sie_formal = $8 WHERE id = $9`,
    [
      input.german,
      input.english,
      input.ich || null,
      input.du || null,
      input.er_sie_es || null,
      input.wir || null,
      input.ihr || null,
      input.sie_formal || null,
      id,
    ]
  );
}

export async function deleteVerb(id: number): Promise<void> {
  await seeded;
  await query("DELETE FROM verbs WHERE id = $1", [id]);
}

export async function deleteVerbSet(setNumber: number): Promise<void> {
  await seeded;
  await query("DELETE FROM verbs WHERE set_number = $1", [setNumber]);
}
