import { type AIStrategy } from "./AIStrategy";
import { Game } from "../Game";
import { Coordinate } from "../Coordinate";

export class ExpertStrategy implements AIStrategy {
  // 盤面の重み付けテーブル（評価マップ）
  private readonly WEIGHT_MAP: Record<string, number> = {
    // 四隅：最高得点
    "0,0": 100, "7,0": 100, "0,7": 100, "7,7": 100,
    // 辺：安定するので高め
    "2,0": 10, "3,0": 5, "4,0": 5, "5,0": 10,
    "2,7": 10, "3,7": 5, "4,7": 5, "5,7": 10,
    "0,2": 10, "0,3": 5, "0,4": 5, "0,5": 10,
    "7,2": 10, "7,3": 5, "7,4": 5, "7,5": 10,
    // 角の隣 (C打ち)：角を取られやすくなるのでマイナス
    "1,0": -20, "0,1": -20, "6,0": -20, "7,1": -20,
    "0,6": -20, "1,7": -20, "7,6": -20, "6,7": -20,
    // 角の斜め内側 (X打ち)：最も危険なので大きなマイナス
    "1,1": -40, "6,1": -40, "1,6": -40, "6,6": -40,
  };

  computeMove(game: Game): Coordinate | null {
    const coords = game.getPuttableCoordinates();
    if (coords.length === 0) return null;

    let bestMove = coords[0];
    let maxScore = -Infinity;

    for (const coord of coords) {
      const key = coord.toKey();
      
      // 1. マスの重みを取得（定義されていないマスは基本点 0）
      const weight = this.WEIGHT_MAP[key] || 0;

      // 2. ひっくり返せる数も少しだけ考慮に入れる（重み 1：1枚 0.5点分など）
      const flips = game.board.countFlips(coord, game.currentPlayer);
      
      // 合計スコア = マスの価値 + (枚数によるボーナス)
      const totalScore = weight + (flips * 0.5);

      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestMove = coord;
      }
    }
    return bestMove;
  }
}