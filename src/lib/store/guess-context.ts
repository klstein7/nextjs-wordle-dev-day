import { createContext } from "react";

export type GuessContext = {
  guess: string;
  setGuess: (guess: string) => void;
};

export const GuessContext = createContext<GuessContext>({
  guess: "",
  setGuess: () => undefined,
});
