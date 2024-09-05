"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useCreateGuess } from "~/lib/hooks/use-create-guess";
import { useGuess } from "~/lib/hooks/use-guess";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      className="h-16 w-16 border text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none"
    />
  );
}

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  const createGuess = useCreateGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          await createGuess(guess, gameId);
        }
      }}
    >
      <InputOTPGroup className="gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
