import { Board } from './Board.ts';
import { Coordinate } from './Coordinate.ts';
import { Disc } from './Disc.ts';

describe('Board (盤面) 値オブジェクト', () => {
  it('初期状態で中央に4つの石が正しく配置されていること', () => {
    const board = Board.createInitialBoard();

    // 中央の座標を定義
    const c33 = new Coordinate(3, 3);
    const c34 = new Coordinate(3, 4);
    const c43 = new Coordinate(4, 3);
    const c44 = new Coordinate(4, 4);

    // 初期配置の確認 (標準的なオセロの並び)
    expect(board.getDiscAt(c33).equals(Disc.WHITE)).toBe(true);
    expect(board.getDiscAt(c34).equals(Disc.BLACK)).toBe(true);
    expect(board.getDiscAt(c43).equals(Disc.BLACK)).toBe(true);
    expect(board.getDiscAt(c44).equals(Disc.WHITE)).toBe(true);
  });

  it('初期状態で中央以外は空であること', () => {
    const board = Board.createInitialBoard();
    const c00 = new Coordinate(0, 0);
    
    expect(board.getDiscAt(c00).equals(Disc.EMPTY)).toBe(true);
  });
});