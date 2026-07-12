"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createOpposite,
  deleteOpposite,
  deleteOppositeSet,
  getNextOppositeSetNumber,
  updateOpposite,
} from "@/lib/db/opposites";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function revalidateOppositePaths() {
  revalidatePath("/categories/adjectives/opposites");
  revalidatePath("/categories/adjectives/opposites/manage");
  revalidatePath("/categories/adjectives/opposites/[set]/test", "page");
}

function parsePairRows(formData: FormData) {
  const wordValues = formData.getAll("word");
  const oppositeValues = formData.getAll("opposite");

  const pairs: { word: string; opposite: string }[] = [];

  for (let i = 0; i < wordValues.length; i++) {
    const word = String(wordValues[i] ?? "").trim();
    const opposite = String(oppositeValues[i] ?? "").trim();

    if (!word || !opposite) continue;

    pairs.push({ word, opposite });
  }

  return pairs;
}

export async function createSetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const pairs = parsePairRows(formData);

  if (pairs.length === 0) {
    return {
      status: "error",
      message: "Add at least one complete pair (word and opposite).",
    };
  }

  const setNumber = await getNextOppositeSetNumber();
  for (const pair of pairs) {
    await createOpposite({ ...pair, setNumber });
  }

  revalidateOppositePaths();

  return {
    status: "success",
    message: `Set ${setNumber} created with ${pairs.length} pair${pairs.length === 1 ? "" : "s"}.`,
  };
}

export async function addPairToSetAction(
  setNumber: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const word = String(formData.get("word") ?? "").trim();
  const opposite = String(formData.get("opposite") ?? "").trim();

  if (!word || !opposite) {
    return { status: "error", message: "Fill in both the word and its opposite." };
  }

  await createOpposite({ word, opposite, setNumber });
  revalidateOppositePaths();

  return { status: "success", message: `Added "${word}" to Set ${setNumber}.` };
}

export async function updateOppositeAction(
  id: number,
  formData: FormData
): Promise<void> {
  const word = String(formData.get("word") ?? "").trim();
  const opposite = String(formData.get("opposite") ?? "").trim();

  if (!word || !opposite) return;

  await updateOpposite(id, { word, opposite });
  revalidateOppositePaths();
}

export async function deleteOppositeAction(id: number): Promise<void> {
  await deleteOpposite(id);
  revalidateOppositePaths();
}

export async function deleteOppositeSetAction(setNumber: number): Promise<void> {
  await deleteOppositeSet(setNumber);
  revalidateOppositePaths();
  redirect("/categories/adjectives/opposites/manage");
}
