import { type AIStrategy } from "./AIStrategy";
import { Game } from "../Game";
import { Coordinate } from "../Coordinate";
import { Disc } from "../Disc";

export class AlphaBetaStrategy implements AIStrategy {
  private readonly SEARCH_DEPTH = 5; // Alpha-Betaなら5手先まで現実的に読めます

  private readonly WEIGHT_MAP: Record<string, number> = {
    "0,0": 100, "7,0": 100, "0,7": 100, "7,7": 100,
    "1,0": -20, "0,1": -20, "6,0": -20, "7,1": -20,
    "0,6": -20, "1,7": -20, "7,6": -20, "6,7": -20,
    "1,1": -40, "6,1": -40, "1,6": -40, "6,6": -40,
  };

  computeMove(game: Game): Coordinate | null {
    const coords = game.getPuttableCoordinates();
    if (coords.length === 0) return null;

    let bestMove = coords[0];
    let alpha = -Infinity; // AIが保証できる最小スコア
    let beta = Infinity;   // プレイヤーが許容する最大スコア

    for (const coord of coords) {
      const score = this.alphabeta(game.play(coord), this.SEARCH_DEPTH - 1, alpha, beta, false);
      if (score > alpha) {
        alpha = score;
        bestMove = coord;
      }
    }
    return bestMove;
  }

  private alphabeta(game: Game, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0 || game.isFinished) {
      return this.evaluate(game);
    }

    const coords = game.getPuttableCoordinates();
    if (coords.length === 0) {
      return this.alphabeta(game.skipTurn(), depth - 1, alpha, beta, !isMaximizing);
    }

    if (isMaximizing) {
      let v = -Infinity;
      for (const coord of coords) {
        v = Math.max(v, this.alphabeta(game.play(coord), depth - 1, alpha, beta, false));
        alpha = Math.max(alpha, v);
        if (beta <= alpha) break; // Betaカット
      }
      return v;
    } else {
      let v = Infinity;
      for (const coord of coords) {
        v = Math.min(v, this.alphabeta(game.play(coord), depth - 1, alpha, beta, true));
        beta = Math.min(beta, v);
        if (beta <= alpha) break; // Alphaカット
      }
      return v;
    }
  }

  private evaluate(game: Game): number {
    // 評価関数はMinimaxと同じですが、探索が深くなることで真価を発揮します
    let score = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const coord = new Coordinate(x, y);
        const disc = game.board.getDiscAt(coord);
        if (disc.equals(Disc.EMPTY)) continue;
        const weight = this.WEIGHT_MAP[coord.toKey()] || 1;
        // CPUは白であると仮定
        score += disc.equals(Disc.WHITE) ? weight : -weight;
      }
    }
    return score;
  }
}