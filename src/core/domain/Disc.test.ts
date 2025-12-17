import { Disc } from './Disc'; 

describe('Disc (石の色) 値オブジェクト', () => {

  // 反転（Flip）メソッドのテスト
  it('should correctly flip the disc color', () => {
    const black = Disc.BLACK; 
    const white = Disc.WHITE;
    const empty = Disc.EMPTY;

    // 黒を反転させると白になる
    expect(black.flip()).toBe(white);
    // 白を反転させると黒になる
    expect(white.flip()).toBe(black);
    // 空を反転させても空のまま
    expect(empty.flip()).toBe(empty);
  });

  // 等価性（Equality）のテスト
  it('should be equal when two discs have the same color value', () => {
      // Disc.BLACK などの参照が同じかどうかではなく、値が同じかを見る
      // Disc クラスを一度 any にキャストしてから new することで、
      // コンパイラの private チェックをバイパスします
      const black1 = Disc.BLACK;
      const black2 = new (Disc as any)('BLACK');
      expect(black1.equals(black2)).toBe(true); // private constructor のため、便宜上 any キャスト
      expect(black1.equals(Disc.WHITE)).toBe(false);
  });
});