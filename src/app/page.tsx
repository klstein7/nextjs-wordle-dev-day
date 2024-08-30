"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { api } from "~/server/api";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          const game = await api.games.create();

          router.push(`/game/${game.id}`);
        }}
      >
        New game
      </Button>
    </main>
  );
}
