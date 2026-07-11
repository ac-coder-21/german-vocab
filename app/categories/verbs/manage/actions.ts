"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createVerb,
  deleteVerb,
  deleteVerbSet,
  getNextVerbSetNumber,
  updateVerb,
} from "@/lib/db/verbs";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function revalidateVerbPaths() {
  revalidatePath("/categories/verbs");
  revalidatePath("/categories/verbs/manage");
  revalidatePath("/categories/verbs/[set]/learn", "page");
  revalidatePath("/categories/verbs/[set]/test-words", "page");
  revalidatePath("/categories/verbs/[set]/learn-conjugation", "page");
  revalidatePath("/categories/verbs/[set]/test-conjugation", "page");
}

function parseWordRows(formData: FormData) {
  const germanValues = formData.getAll("german");
  const englishValues = formData.getAll("english");

  const words: { german: string; english: string }[] = [];

  for (let i = 0; i < germanValues.length; i++) {
    const german = String(germanValues[i] ?? "").trim();
    const english = String(englishValues[i] ?? "").trim();

    if (!german || !english) continue;

    words.push({ german, english });
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
      message: "Add at least one complete verb (German and English).",
    };
  }

  const setNumber = getNextVerbSetNumber();
  for (const word of words) {
    createVerb({ ...word, setNumber });
  }

  revalidateVerbPaths();

  return {
    status: "success",
    message: `Set ${setNumber} created with ${words.length} verb${words.length === 1 ? "" : "s"}.`,
  };
}

export async function addWordToSetAction(
  setNumber: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();

  if (!german || !english) {
    return { status: "error", message: "Fill in both German and English." };
  }

  createVerb({ german, english, setNumber });
  revalidateVerbPaths();

  return { status: "success", message: `Added "${german}" to Set ${setNumber}.` };
}

export async function updateVerbAction(
  id: number,
  formData: FormData
): Promise<void> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();

  if (!german || !english) return;

  updateVerb(id, {
    german,
    english,
    ich: String(formData.get("ich") ?? "").trim(),
    du: String(formData.get("du") ?? "").trim(),
    er_sie_es: String(formData.get("er_sie_es") ?? "").trim(),
    wir: String(formData.get("wir") ?? "").trim(),
    ihr: String(formData.get("ihr") ?? "").trim(),
    sie_formal: String(formData.get("sie_formal") ?? "").trim(),
  });
  revalidateVerbPaths();
}

export async function deleteVerbAction(id: number): Promise<void> {
  deleteVerb(id);
  revalidateVerbPaths();
}

export async function deleteVerbSetAction(setNumber: number): Promise<void> {
  deleteVerbSet(setNumber);
  revalidateVerbPaths();
  redirect("/categories/verbs/manage");
}
