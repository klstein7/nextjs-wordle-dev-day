import { useRouter } from "next/navigation";

import { api } from "~/server/api";

export const useCreateGame = (withRedirect = true) => {
  const router = useRouter();

  return async () => {
    const game = await api.games.create();

    if (withRedirect) {
      router.push(`/game/${game.id}`);
    }

    return game;
  };
};
