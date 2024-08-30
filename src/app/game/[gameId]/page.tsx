import { GameBoard } from "~/components/game-board";
import { api } from "~/server/api";

export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    <div className="flex h-full items-center justify-center">
      <GameBoard gameId={gameId} guesses={guesses} />
    </div>
  );
}
