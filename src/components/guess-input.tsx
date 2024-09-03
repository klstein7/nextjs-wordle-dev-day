"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          await api.guesses.create(guess, gameId);
          setGuess("");
        }
      }}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} className="h-12 w-12 text-2xl uppercase" />
        <InputOTPSlot index={1} className="h-12 w-12 text-2xl uppercase" />
        <InputOTPSlot index={2} className="h-12 w-12 text-2xl uppercase" />
        <InputOTPSlot index={3} className="h-12 w-12 text-2xl uppercase" />
        <InputOTPSlot index={4} className="h-12 w-12 text-2xl uppercase" />
      </InputOTPGroup>
    </InputOTP>
  );
};
