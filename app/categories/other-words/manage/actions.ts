"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createOtherWord,
  deleteOtherWord,
  deleteOtherWordSet,
  getNextOtherWordSetNumber,
  updateOtherWord,
} from "@/lib/db/other-words";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function revalidateOtherWordPaths() {
  revalidatePath("/categories/other-words");
  revalidatePath("/categories/other-words/manage");
  revalidatePath("/categories/other-words/[set]/learn", "page");
  revalidatePath("/categories/other-words/[set]/test-words", "page");
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

  const setNumber = await getNextOtherWordSetNumber();
  for (const word of words) {
    await createOtherWord({ ...word, setNumber });
  }

  revalidateOtherWordPaths();

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

  await createOtherWord({ german, english, setNumber });
  revalidateOtherWordPaths();

  return { status: "success", message: `Added "${german}" to Set ${setNumber}.` };
}

export async function updateOtherWordAction(
  id: number,
  formData: FormData
): Promise<void> {
  const german = String(formData.get("german") ?? "").trim();
  const english = String(formData.get("english") ?? "").trim();

  if (!german || !english) return;

  await updateOtherWord(id, { german, english });
  revalidateOtherWordPaths();
}

export async function deleteOtherWordAction(id: number): Promise<void> {
  await deleteOtherWord(id);
  revalidateOtherWordPaths();
}

export async function deleteOtherWordSetAction(setNumber: number): Promise<void> {
  await deleteOtherWordSet(setNumber);
  revalidateOtherWordPaths();
  redirect("/categories/other-words/manage");
}
