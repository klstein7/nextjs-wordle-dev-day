"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useState } from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const GuessInput = () => {
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          console.log(guess);
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
