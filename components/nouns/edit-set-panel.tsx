"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Noun, NounSet } from "@/lib/db/nouns";
import {
  addWordToSetAction,
  deleteNounAction,
  deleteSetAction,
  updateNounAction,
  type ActionState,
} from "@/app/categories/nouns/manage/actions";

const initialState: ActionState = { status: "idle", message: "" };

const fieldClass =
  "min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function EditSetPanel({
  sets,
  selectedSet,
  nouns,
}: {
  sets: NounSet[];
  selectedSet: number | undefined;
  nouns: Noun[];
}) {
  const router = useRouter();

  if (sets.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No sets yet — create one first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Select
          value={selectedSet !== undefined ? String(selectedSet) : undefined}
          onValueChange={(value) =>
            router.push(`/categories/nouns/manage?set=${value}`, { scroll: false })
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select a set" />
          </SelectTrigger>
          <SelectContent>
            {sets.map((set) => (
              <SelectItem key={set.setNumber} value={String(set.setNumber)}>
                Set {set.setNumber} ({set.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSet !== undefined && (
        <>
          <div className="flex flex-col gap-2">
            {nouns.map((noun) => (
              <NounRow key={noun.id} noun={noun} />
            ))}
            {nouns.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No words in this set yet.
              </p>
            )}
          </div>

          <AddWordForm setNumber={selectedSet} />

          <DeleteSetButton setNumber={selectedSet} />
        </>
      )}
    </div>
  );
}

function NounRow({ noun }: { noun: Noun }) {
  const updateWithId = updateNounAction.bind(null, noun.id);
  const deleteWithId = deleteNounAction.bind(null, noun.id);

  return (
    <form
      action={updateWithId}
      className="flex flex-wrap items-center gap-2 rounded-xl border bg-background/60 p-3"
    >
      <select name="artikel" defaultValue={noun.artikel} className={fieldClass}>
        <option value="der">der</option>
        <option value="die">die</option>
        <option value="das">das</option>
      </select>
      <input name="german" defaultValue={noun.german} className={fieldClass} />
      <input name="english" defaultValue={noun.english} className={fieldClass} />
      <Button type="submit" variant="outline" size="sm">
        Save
      </Button>
      <Button
        type="submit"
        formAction={deleteWithId}
        variant="ghost"
        size="icon"
        aria-label="Delete word"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

function AddWordForm({ setNumber }: { setNumber: number }) {
  const boundAction = addWordToSetAction.bind(null, setNumber);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed bg-background/40 p-3"
    >
      <select name="artikel" defaultValue="der" className={fieldClass}>
        <option value="der">der</option>
        <option value="die">die</option>
        <option value="das">das</option>
      </select>
      <input name="german" placeholder="German" className={fieldClass} />
      <input name="english" placeholder="English" className={fieldClass} />
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add word"}
      </Button>
      {state.status === "error" && (
        <p className="w-full text-sm text-destructive">{state.message}</p>
      )}
    </form>
  );
}

function DeleteSetButton({ setNumber }: { setNumber: number }) {
  const boundAction = deleteSetAction.bind(null, setNumber);

  return (
    <form action={boundAction} className="flex justify-end border-t pt-4">
      <Button
        type="submit"
        variant="destructive"
        onClick={(e) => {
          if (
            !window.confirm(
              `Delete Set ${setNumber} and all its words? This can't be undone.`
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="size-4" />
        Delete Set {setNumber}
      </Button>
    </form>
  );
}
