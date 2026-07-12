"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSetAction, type ActionState } from "@/app/categories/nouns/manage/actions";

const initialState: ActionState = { status: "idle", message: "" };

const fieldClass =
  "min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

let rowIdCounter = 0;
function makeRowId() {
  rowIdCounter += 1;
  return rowIdCounter;
}

function freshRows() {
  return [makeRowId(), makeRowId(), makeRowId()];
}

export function NewSetForm({ nextSetNumber }: { nextSetNumber: number }) {
  const [state, formAction, pending] = useActionState(createSetAction, initialState);
  const [rows, setRows] = useState<number[]>(freshRows);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setRows(freshRows());
    }
  }, [state]);

  const addRow = () => setRows((r) => [...r, makeRowId()]);
  const removeRow = (id: number) =>
    setRows((r) => (r.length > 1 ? r.filter((rowId) => rowId !== id) : r));

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Creating</span>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          Set {nextSetNumber}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((id) => (
          <div
            key={id}
            className="flex flex-wrap items-center gap-2 rounded-xl border bg-card/60 p-3"
          >
            <select name="artikel" defaultValue="der" className={fieldClass}>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </select>
            <input name="german" placeholder="German (e.g. Tisch)" className={fieldClass} />
            <input name="english" placeholder="English (e.g. table)" className={fieldClass} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(id)}
              disabled={rows.length === 1}
              aria-label="Remove word"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addRow} className="self-start">
        <Plus className="size-4" />
        Add word
      </Button>

      {state.message && (
        <p
          className={
            state.status === "error"
              ? "text-sm text-destructive"
              : "text-sm text-emerald-600 dark:text-emerald-400"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Creating…" : `Create Set ${nextSetNumber}`}
      </Button>
    </form>
  );
}
