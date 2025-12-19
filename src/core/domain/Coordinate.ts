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
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // 後で x, y の範囲チェックロジックを追加します
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
    return this.x === other.x && this.y === other.y;
  }

  /** 
   * 座標を一意の文字列キーに変換する（Mapのキー用）
   * @returns 文字列キー（例：'3,4'）
   */
  public toKey(): string {
    return `${this.x},${this.y}`;
  }

  
  /**
   * 指定された方向に移動した新しい座標を返す。
   * 盤面外に出る場合は null を返す。
   */
  public getNeighbor(dx: number, dy: number): Coordinate | null {
    try {
      return new Coordinate(this.x + dx, this.y + dy);
    } catch (e) {
      // 範囲外(0-7以外)でエラーになる想定
      return null;
    }
  }
}