import { Game } from "../Game";
import { Coordinate } from "../Coordinate";

export interface AIStrategy {
  computeMove(game: Game): Coordinate | null;
}