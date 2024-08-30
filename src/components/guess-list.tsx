"use client";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  guesses: string[];
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {guesses.map((guess) => (
        <GuessItem key={guess} guess={guess} />
      ))}
    </div>
  );
};
