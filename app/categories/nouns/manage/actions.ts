"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createNoun,
  deleteNoun,
  deleteSet,
  getNextSetNumber,
  updateNoun,
  type Artikel,
} from "@/lib/db/nouns";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const ARTIKEL_VALUES: Artikel[] = ["der", "die", "das"];

function isArtikel(value: FormDataEntryValue | null): value is Artikel {
  return typeof value === "string" && ARTIKEL_VALUES.includes(value as Artikel);
}

function revalidateNounPaths() {
  revalidatePath("/categories/nouns");
  revalidatePath("/categories/nouns/manage");
  revalidatePath("/categories/nouns/[set]/learn", "page");
}

function parseWordRows(formData: FormData) {
  const germanValues = formData.getAll("german");
  const englishValues = formData.getAll("english");
  const artikelValues = formData.getAll("artikel");

  const words: { german: string; english: string; artikel: Artikel }[] = [];

  for (let i = 0; i < germanValues.length; i++) {
    const german = String(germanValues[i] ?? "").trim();
    const english = String(englishValues[i] ?? "").trim();
    const artikel = artikelValues[i];

    if (!german || !english || !isArtikel(artikel)) continue;

    words.push({ german, english, artikel });
  }

  return words;
}

export async function createSetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const words = parseWordRows(formData);

  if (words.length === 0) {
    return {
      status: "error",
      message: "Add at least one complete word (German, English, and artikel).",
    };
  }

  const setNumber = getNextSetNumber();
  for (const word of words) {
    createNoun({ ...word, setNumber });
  }

  revalidateNounPaths();

  return {
    status: "success",
    message: `Set ${setNumber} created with ${words.length} word${words.length === 1 ? "" : "s"}.`,
  };
}

export async function addWordToSetAction(
  setNumber: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();
  const artikel = formData.get("artikel");

  if (!german || !english || !isArtikel(artikel)) {
    return { status: "error", message: "Fill in German, English, and artikel." };
  }

  createNoun({ german, english, artikel, setNumber });
  revalidateNounPaths();

  return { status: "success", message: `Added "${german}" to Set ${setNumber}.` };
}

export async function updateNounAction(
  id: number,
  formData: FormData
): Promise<void> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();
  const artikel = formData.get("artikel");

  if (!german || !english || !isArtikel(artikel)) return;

  updateNoun(id, { german, english, artikel });
  revalidateNounPaths();
}

export async function deleteNounAction(id: number): Promise<void> {
  deleteNoun(id);
  revalidateNounPaths();
}

export async function deleteSetAction(setNumber: number): Promise<void> {
  deleteSet(setNumber);
  revalidateNounPaths();
  redirect("/categories/nouns/manage");
}
