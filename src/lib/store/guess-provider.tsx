"use client";

import { useState } from "react";

import { GuessContext } from "./guess-context";

export const GuessProvider = ({ children }: { children: React.ReactNode }) => {
  const [guess, setGuess] = useState<string>("");

  return (
    <GuessContext.Provider value={{ guess, setGuess }}>
      {children}
    </GuessContext.Provider>
  );
};
