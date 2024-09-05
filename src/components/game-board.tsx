import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GameResultsDialog } from "./game-results-dialog";
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  status: (typeof games.status.enumValues)[number];
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameBoard = ({ gameId, status, guesses }: GameBoardProps) => {
  return (
    <div className="flex grow flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        <GuessList guesses={guesses} />
        {status === "in_progress" && <GuessInput gameId={gameId} />}
      </div>
      <GameResultsDialog status={status} guesses={guesses} />
    </div>
  );
};
