"use client";

import { type api } from "~/server/api";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {guesses.map((guess) => (
        <GuessItem key={guess.id} guess={guess} />
      ))}
    </div>
  );
};
