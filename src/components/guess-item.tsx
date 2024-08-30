"use client";

import { cn } from "~/lib/utils";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: string;
};

function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase")}
    />
  );
}

export function GuessItem({ guess }: GuessItemProps) {
  return (
    <InputOTP readOnly maxLength={5} value={guess}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
