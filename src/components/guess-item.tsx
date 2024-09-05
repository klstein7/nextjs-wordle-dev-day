"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn(
        "h-16 w-16 border-none text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none",
        {
          "bg-red-500 text-red-50": result === "X",
          "bg-green-500 text-green-50": result === "C",
          "bg-yellow-500 text-yellow-50": result === "~",
        },
      )}
    />
  );
}

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup className="gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot
            key={index}
            index={index}
            result={guess.result[index] ?? ""}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};