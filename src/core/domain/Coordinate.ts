import { MIN_COORD, MAX_COORD } from "./Board.ts";

// 8方向の定義
export const DIRECTIONS = [
  { x: 0, y: -1 }, // 上
  { x: 0, y: 1 },  // 下
  { x: -1, y: 0 }, // 左
  { x: 1, y: 0 },  // 右
  { x: -1, y: -1 },// 左上
  { x: 1, y: -1 }, // 右上
  { x: -1, y: 1 }, // 左下
  { x: 1, y: 1 },  // 右下
];

export class Coordinate {
  // 値オブジェクトは不変であるため、プロパティを readonly にする
  private readonly _x: number;
  private readonly _y: number;

  constructor(x: number, y: number) {
    if (x < MIN_COORD || x > MAX_COORD || y < MIN_COORD || y > MAX_COORD) {
      throw new Error(`Invalid coordinate: (${x}, ${y})`);
    }
    this._x = x;
    this._y = y;
  }

  /**
   * 値オブジェクトの等価性を判定する（equalsメソッド）
   * @param other - 比較対象の Coordinate
   * @returns 値が等しければ true
   */
  public equals(other: Coordinate): boolean {
    if (!(other instanceof Coordinate)) {
      return false;
    }
    return this._x === other._x && this._y === other._y;
  }

  /** 
   * 座標を一意の文字列キーに変換する（Mapのキー用）
   * @returns 文字列キー（例：'3,4'）
   */
  public toKey(): string {
    return `${this._x},${this._y}`;
  }

  
  /**
   * 指定された方向に移動した新しい座標を返す。
   * 盤面外に出る場合は null を返す。
   */
  public getNeighbor(dx: number, dy: number): Coordinate | null {
    try {
      return new Coordinate(this._x + dx, this._y + dy);
    } catch (e) {
      // 範囲外(MIN_COORD-MAX_COORD以外)でエラーになる想定
      return null;
    }
  }
}