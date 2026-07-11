// Kept separate from lib/db/verbs.ts (which has top-level side effects that
// open the SQLite connection) so client components can import this constant
// without accidentally pulling node:sqlite into the browser bundle.

export type Conjugation = {
  ich: string;
  du: string;
  er_sie_es: string;
  wir: string;
  ihr: string;
  sie_formal: string;
};

export const PRONOUNS: { key: keyof Conjugation; label: string }[] = [
  { key: "ich", label: "ich" },
  { key: "du", label: "du" },
  { key: "er_sie_es", label: "er/sie/es" },
  { key: "wir", label: "wir" },
  { key: "ihr", label: "ihr" },
  { key: "sie_formal", label: "sie/Sie" },
];
