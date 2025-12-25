import { type AIStrategy } from "./AIStrategy";
import { Game } from "../Game";
import { Coordinate } from "../Coordinate";

export class StrongStrategy implements AIStrategy {
  computeMove(game: Game): Coordinate | null {
    const coords = game.getPuttableCoordinates();
    if (coords.length === 0) return null;

    let bestMove = coords[0];
    let maxScore = -Infinity;

    // 四隅の座標をあらかじめ定義（比較用）
    const corners = [
      new Coordinate(0, 0).toKey(),
      new Coordinate(0, 7).toKey(),
      new Coordinate(7, 0).toKey(),
      new Coordinate(7, 7).toKey()
    ];

    for (const coord of coords) {
      let score = game.board.countFlips(coord, game.currentPlayer);

      // toKey() を使って隅かどうかを判定
      if (corners.includes(coord.toKey())) {
        score += 100; // 角ボーナス
      }

      if (score > maxScore) {
        maxScore = score;
        bestMove = coord;
      }
    }
    return bestMove;
  }
}