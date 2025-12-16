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
}