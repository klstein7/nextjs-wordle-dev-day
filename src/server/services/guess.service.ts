import { asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { games, guesses } from "../db/schema";
import { gameService } from "./game.service";

const checkGuess = async (guess: string, gameId: number) => {
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (!game) {
    throw new Error("Game not found");
  }

  const actualWord = game.word.toUpperCase();
  const upperGuess = guess.toUpperCase();
  const result = new Array(5).fill("X");
  const charCount = new Map();

  // Count occurrences of each character in actualWord
  for (const char of actualWord) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (upperGuess[i] === actualWord[i]) {
      result[i] = "C";
      charCount.set(upperGuess[i], charCount.get(upperGuess[i]) - 1);
    }
  }

  // Second pass: mark misplaced letters
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "C" && charCount.get(upperGuess[i]) > 0) {
      result[i] = "~";
      charCount.set(upperGuess[i], charCount.get(upperGuess[i]) - 1);
    }
  }

  return result.join("");
};

const create = async (guess: string, gameId: number) => {
  const result = await checkGuess(guess, gameId);

  const [createdGuess] = await db
    .insert(guesses)
    .values({
      gameId,
      guess,
      result,
    })
    .returning();

  if (!createdGuess) {
    throw new Error("Failed to create guess");
  }

  const count = await countByGameId(gameId);

  if (count === 5 && createdGuess.result.includes("X")) {
    await gameService.update(gameId, "lost");
  }

  if (createdGuess.result === "CCCCC") {
    await gameService.update(gameId, "won");
  }

  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

const findByGameId = async (gameId: number) => {
  return db.query.guesses.findMany({
    where: eq(guesses.gameId, gameId),
    orderBy: [asc(guesses.createdAt)],
  });
};

const countByGameId = async (gameId: number) => {
  const [gameCount] = await db
    .select({ count: count() })
    .from(guesses)
    .where(eq(guesses.gameId, gameId));

  if (!gameCount) {
    throw new Error("Error counting guesses");
  }

  return gameCount.count;
};

export const guessService = {
  create,
  findByGameId,
};
