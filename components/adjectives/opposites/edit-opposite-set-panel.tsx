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
import type { Opposite, OppositeSet } from "@/lib/db/opposites";
import {
  addPairToSetAction,
  deleteOppositeAction,
  deleteOppositeSetAction,
  updateOppositeAction,
  type ActionState,
} from "@/app/categories/adjectives/opposites/manage/actions";

const initialState: ActionState = { status: "idle", message: "" };

const fieldClass =
  "min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function EditOppositeSetPanel({
  sets,
  selectedSet,
  opposites,
}: {
  sets: OppositeSet[];
  selectedSet: number | undefined;
  opposites: Opposite[];
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
            router.push(`/categories/adjectives/opposites/manage?set=${value}`, {
              scroll: false,
            })
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
            {opposites.map((opposite) => (
              <OppositeRow key={opposite.id} opposite={opposite} />
            ))}
            {opposites.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No pairs in this set yet.
              </p>
            )}
          </div>

          <AddPairForm setNumber={selectedSet} />

          <DeleteSetButton setNumber={selectedSet} />
        </>
      )}
    </div>
  );
}

function OppositeRow({ opposite }: { opposite: Opposite }) {
  const updateWithId = updateOppositeAction.bind(null, opposite.id);
  const deleteWithId = deleteOppositeAction.bind(null, opposite.id);

  return (
    <form
      action={updateWithId}
      className="flex flex-wrap items-center gap-2 rounded-xl border bg-background/60 p-3"
    >
      <input name="word" defaultValue={opposite.word} className={fieldClass} />
      <input name="opposite" defaultValue={opposite.opposite} className={fieldClass} />
      <Button type="submit" variant="outline" size="sm">
        Save
      </Button>
      <Button
        type="submit"
        formAction={deleteWithId}
        variant="ghost"
        size="icon"
        aria-label="Delete pair"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

function AddPairForm({ setNumber }: { setNumber: number }) {
  const boundAction = addPairToSetAction.bind(null, setNumber);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed bg-background/40 p-3"
    >
      <input name="word" placeholder="Word" className={fieldClass} />
      <input name="opposite" placeholder="Opposite" className={fieldClass} />
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add pair"}
      </Button>
      {state.status === "error" && (
        <p className="w-full text-sm text-destructive">{state.message}</p>
      )}
    </form>
  );
}

function DeleteSetButton({ setNumber }: { setNumber: number }) {
  const boundAction = deleteOppositeSetAction.bind(null, setNumber);

  return (
    <form action={boundAction} className="flex justify-end border-t pt-4">
      <Button
        type="submit"
        variant="destructive"
        onClick={(e) => {
          if (
            !window.confirm(
              `Delete Set ${setNumber} and all its pairs? This can't be undone.`
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
