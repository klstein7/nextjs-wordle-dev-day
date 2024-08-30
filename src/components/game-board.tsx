import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

export const GameBoard = () => {
  const guesses = ["HELLO", "WORLD"];
  return (
    <div className="flex flex-col gap-3">
      <GuessList guesses={guesses} />
      <GuessInput />
    </div>
  );
};
