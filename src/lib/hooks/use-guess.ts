import { useContext } from "react";

import { GuessContext } from "../store/guess-context";

export const useGuess = () => {
  return useContext(GuessContext);
};
