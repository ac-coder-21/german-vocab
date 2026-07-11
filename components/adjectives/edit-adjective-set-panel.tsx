"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Adjective, AdjectiveSet } from "@/lib/db/adjectives";
import {
  addWordToSetAction,
  deleteAdjectiveAction,
  deleteAdjectiveSetAction,
  updateAdjectiveAction,
  type ActionState,
} from "@/app/categories/adjectives/manage/actions";

const initialState: ActionState = { status: "idle", message: "" };

const fieldClass =
  "min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function EditAdjectiveSetPanel({
  sets,
  selectedSet,
  adjectives,
}: {
  sets: AdjectiveSet[];
  selectedSet: number | undefined;
  adjectives: Adjective[];
}) {
  if (sets.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No sets yet — create one first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {sets.map((set) => (
          <Link
            key={set.setNumber}
            href={`/categories/adjectives/manage?set=${set.setNumber}`}
            scroll={false}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              selectedSet === set.setNumber
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            Set {set.setNumber}
            <span className="ml-1.5 opacity-70">({set.count})</span>
          </Link>
        ))}
      </div>

      {selectedSet !== undefined && (
        <>
          <div className="flex flex-col gap-2">
            {adjectives.map((adjective) => (
              <AdjectiveRow key={adjective.id} adjective={adjective} />
            ))}
            {adjectives.length === 0 && (
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

function AdjectiveRow({ adjective }: { adjective: Adjective }) {
  const updateWithId = updateAdjectiveAction.bind(null, adjective.id);
  const deleteWithId = deleteAdjectiveAction.bind(null, adjective.id);

  return (
    <form
      action={updateWithId}
      className="flex flex-wrap items-center gap-2 rounded-xl border bg-background/60 p-3"
    >
      <input name="german" defaultValue={adjective.german} className={fieldClass} />
      <input name="english" defaultValue={adjective.english} className={fieldClass} />
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
  const boundAction = deleteAdjectiveSetAction.bind(null, setNumber);

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
