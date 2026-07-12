"use client";

import { Menu } from "@base-ui/react/menu";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

export type SetOption = { setNumber: number; count: number };

export function SetPicker({
  sets,
  selected,
  onToggle,
}: {
  sets: SetOption[];
  selected: number[];
  onToggle: (setNumber: number) => void;
}) {
  const label =
    selected.length === 0
      ? "Select sets"
      : selected.length === sets.length
        ? "All sets"
        : selected.length === 1
          ? `Set ${selected[0]}`
          : `${selected.length} sets selected`;

  return (
    <Menu.Root>
      <Menu.Trigger className="flex h-8 w-56 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted dark:bg-input/30 dark:hover:bg-input/50">
        {label}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="isolate z-50" sideOffset={4} align="center">
          <Menu.Popup className="max-h-(--available-height) w-(--anchor-width) min-w-56 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {sets.map((set) => {
              const checked = selected.includes(set.setNumber);
              return (
                <Menu.CheckboxItem
                  key={set.setNumber}
                  checked={checked}
                  onCheckedChange={() => onToggle(set.setNumber)}
                  className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <Menu.CheckboxItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </Menu.CheckboxItemIndicator>
                  Set {set.setNumber} ({set.count})
                </Menu.CheckboxItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
