import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdjectivesPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Adjektive</p>
      <h1 className="text-4xl font-bold tracking-tight">Adjectives</h1>
      <p className="max-w-md text-muted-foreground">
        The adjective test is coming soon. Check back shortly!
      </p>
      <Button
        render={<Link href="/categories" />}
        nativeButton={false}
        variant="outline"
        className="mt-2"
      >
        <ArrowLeft className="size-4" />
        Back to categories
      </Button>
    </div>
  );
}
