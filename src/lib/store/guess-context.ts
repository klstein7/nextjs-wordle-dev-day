import { createContext } from "react";
import { unknown } from "zod";

export type GuessContext = {
  guess: string;
  setGuess: (guess: string) => void;
};

export const GuessContext = createContext<GuessContext>({
  guess: "",
  setGuess: () => unknown,
});
