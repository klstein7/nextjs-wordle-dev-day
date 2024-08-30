"use server";

import { guessService } from "../services/guess.service";

export const create = async (guess: string, gameId: number) => {
  return guessService.create(guess, gameId);
};

export const findByGameId = async (gameId: number) => {
  return guessService.findByGameId(gameId);
};
