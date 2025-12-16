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
});