// src/core/domain/Disc.ts

export class Disc {
  // 値オブジェクトは不変であるため readonly にする
  private readonly color: 'BLACK' | 'WHITE' | 'EMPTY';

  // コンストラクタを private にして外部からの new を禁止
  private constructor(color: 'BLACK' | 'WHITE' | 'EMPTY') {
    this.color = color;
  }

  // 反転メソッド (flip)
  public flip(): Disc {
    if (this.color === 'BLACK') return Disc.WHITE;
    if (this.color === 'WHITE') return Disc.BLACK;
    // EMPTYの場合はEMPTYを返す
    return Disc.EMPTY;
  }

  /**
   * 値オブジェクトの等価性を判定する（equalsメソッド）
   * @param other - 比較対象の Disc
   * @returns 値が等しければ true
   */
  public equals(other: Disc): boolean {
    if (!(other instanceof Disc)) {
      return false;
    }
    return this.color === other.color;
  }

  // 静的な定数（ファクトリ）
  public static readonly BLACK = new Disc('BLACK');
  public static readonly WHITE = new Disc('WHITE');
  public static readonly EMPTY = new Disc('EMPTY');
}