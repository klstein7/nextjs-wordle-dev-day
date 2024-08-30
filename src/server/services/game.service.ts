import { eq } from "drizzle-orm";

import { getRandomWord } from "~/lib/utils";

import { db } from "../db";
import { games } from "../db/schema";

export const getById = async (id: number) => {
  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
  });

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

const create = async () => {
  const randomWord = getRandomWord();

  const [word] = await db
    .insert(games)
    .values({ word: randomWord.toUpperCase(), status: "in_progress" })
    .returning();

  if (!word) {
    throw new Error("Failed to create game");
  }

  return word;
};

export const update = async (
  id: number,
  status: (typeof games.status.enumValues)[number],
) => {
  const [game] = await db
    .update(games)
    .set({ status })
    .where(eq(games.id, id))
    .returning();

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

export const gameService = {
  create,
  getById,
  update,
};
