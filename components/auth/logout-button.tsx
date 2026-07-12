import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/logout/actions";

export function LogoutButton({ email }: { email?: string }) {
  return (
    <form action={logoutAction} className="flex items-center gap-2">
      {email && <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>}
      <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
        <LogOut className="size-4" />
      </Button>
    </form>
  );
}
