import { Game } from "../Game";
import { Coordinate } from "../Coordinate";
import { type AIStrategy } from "./AIStrategy";

/**
 * 強欲法：最も多くの石を取れる場所を選択する
 */
export class GreedyStrategy implements AIStrategy {
  computeMove(game: Game): Coordinate | null {
    const puttableCoords = game.getPuttableCoordinates();
    if (puttableCoords.length === 0) return null;

    let bestMove = puttableCoords[0];
    let maxFlips = -1;

    for (const coord of puttableCoords) {
      const flips = game.board.countFlips(coord, game.currentPlayer);
      if (flips > maxFlips) {
        maxFlips = flips;
        bestMove = coord;
      }
    }
    return bestMove;
  }
}