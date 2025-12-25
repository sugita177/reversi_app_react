import { type AIStrategy } from "./AIStrategy";
import { Game } from "../Game";
import { Coordinate } from "../Coordinate";
import { Disc } from "../Disc";

export class MinimaxStrategy implements AIStrategy {
  private readonly SEARCH_DEPTH = 3; // 読みの深さ

  // ExpertStrategyと同じ重み付けテーブルを使用
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
    let bestScore = -Infinity;

    for (const coord of coords) {
      // 1手進めた仮想のゲーム状態を作る
      const nextGame = game.play(coord);
      // その後の展開を予測してスコアを算出
      const score = this.minimax(nextGame, this.SEARCH_DEPTH - 1, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = coord;
      }
    }
    return bestMove;
  }

  /**
   * Minimax法本体
   * isMaximizing: 現在の手番がAI（自分の得点を最大化したい）ならtrue
   */
  private minimax(game: Game, depth: number, isMaximizing: boolean): number {
    if (depth === 0 || game.isFinished) {
      return this.evaluate(game);
    }

    const coords = game.getPuttableCoordinates();
    
    // パスの場合
    if (coords.length === 0) {
      return this.minimax(game.skipTurn(), depth - 1, !isMaximizing);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const coord of coords) {
        const evalScore = this.minimax(game.play(coord), depth - 1, false);
        maxEval = Math.max(maxEval, evalScore);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const coord of coords) {
        const evalScore = this.minimax(game.play(coord), depth - 1, true);
        minEval = Math.min(minEval, evalScore);
      }
      return minEval;
    }
  }

  // 盤面の評価（AIから見た良さ）
  private evaluate(game: Game): number {
    let score = 0;
    // 盤面全体の石を走査して重みを合計
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const coord = new Coordinate(x, y);
        const disc = game.board.getDiscAt(coord);
        
        if (disc.equals(Disc.EMPTY)) continue;

        const weight = this.WEIGHT_MAP[coord.toKey()] || 1;
        // 自分の石ならプラス、相手ならマイナス
        if (disc.equals(Disc.WHITE)) { // AIは白と想定
          score += weight;
        } else {
          score -= weight;
        }
      }
    }
    return score;
  }
}