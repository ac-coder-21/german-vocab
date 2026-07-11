"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createAdjective,
  deleteAdjective,
  deleteAdjectiveSet,
  getNextAdjectiveSetNumber,
  updateAdjective,
} from "@/lib/db/adjectives";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function revalidateAdjectivePaths() {
  revalidatePath("/categories/adjectives");
  revalidatePath("/categories/adjectives/manage");
  revalidatePath("/categories/adjectives/[set]/learn", "page");
  revalidatePath("/categories/adjectives/[set]/test-words", "page");
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
      message: "Add at least one complete word (German and English).",
    };
  }

  const setNumber = getNextAdjectiveSetNumber();
  for (const word of words) {
    createAdjective({ ...word, setNumber });
  }

  revalidateAdjectivePaths();

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

  if (!german || !english) {
    return { status: "error", message: "Fill in both German and English." };
  }

  createAdjective({ german, english, setNumber });
  revalidateAdjectivePaths();

  return { status: "success", message: `Added "${german}" to Set ${setNumber}.` };
}

export async function updateAdjectiveAction(
  id: number,
  formData: FormData
): Promise<void> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();

  if (!german || !english) return;

  updateAdjective(id, { german, english });
  revalidateAdjectivePaths();
}

export async function deleteAdjectiveAction(id: number): Promise<void> {
  deleteAdjective(id);
  revalidateAdjectivePaths();
}

export async function deleteAdjectiveSetAction(setNumber: number): Promise<void> {
  deleteAdjectiveSet(setNumber);
  revalidateAdjectivePaths();
  redirect("/categories/adjectives/manage");
}
