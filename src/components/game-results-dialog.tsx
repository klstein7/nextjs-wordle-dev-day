"use client";

import { HeartCrack, Trophy } from "lucide-react";
import { useMemo } from "react";
import Confetti from "react-confetti";

import { useCreateGame } from "~/lib/hooks/use-create-game";
import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GuessItem } from "./guess-item";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type GameResultsDialogProps = {
  status: (typeof games.status.enumValues)[number];
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameResultsDialog = ({
  status,
  guesses,
}: GameResultsDialogProps) => {
  const createGame = useCreateGame();

  if (status === "in_progress") return null;

  return (
    <Dialog open={true}>
      <DialogContent
        className="flex flex-col items-center gap-6 rounded-2xl p-12 md:max-w-fit"
        withClose={false}
      >
        {status === "won" ? (
          <>
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <div className="text-7xl font-bold">you are</div>
                <div className="text-7xl font-bold text-green-500">
                  awesome!
                </div>
              </div>
              {guesses.map((guess) => (
                <GuessItem key={guess.id} guess={guess} />
              ))}
            </div>
            <Confetti
              className="h-full w-full"
              numberOfPieces={200}
              gravity={0.05}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <div className="text-7xl font-bold">better luck</div>
              <div className="text-7xl font-bold text-red-500">next time!</div>
            </div>
            {guesses.map((guess) => (
              <GuessItem key={guess.id} guess={guess} />
            ))}
          </div>
        )}
        <Button
          variant="outline"
          className="h-14 w-full rounded-xl text-xl font-semibold"
          size="lg"
          onClick={() => createGame()}
        >
          Play again!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
