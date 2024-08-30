import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { words } from "./words";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  if (!word) {
    throw new Error("Error retrieving random word");
  }
  return word;
}
