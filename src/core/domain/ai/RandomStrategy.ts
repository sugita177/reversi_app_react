import { type AIStrategy } from "./AIStrategy";
import { Game } from "../Game";
import { Coordinate } from "../Coordinate";

export class RandomStrategy implements AIStrategy {
  computeMove(game: Game): Coordinate | null {
    const coords = game.getPuttableCoordinates();
    if (coords.length === 0) return null;
    return coords[Math.floor(Math.random() * coords.length)];
  }
}