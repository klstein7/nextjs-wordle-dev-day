"use server";

import { gameService } from "../services/game.service";

export const create = async () => {
  return gameService.create();
};

export const getById = async (id: number) => {
  return gameService.getById(id);
};
