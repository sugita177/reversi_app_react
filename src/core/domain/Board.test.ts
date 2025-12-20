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

  it('指定した座標に石を置いた新しい盤面を返すこと', () => {
    const board = Board.createInitialBoard();
    const target = new Coordinate(2, 3);
    
    // (2,3) に黒を置く
    const newBoard = board.placeDisc(target, Disc.BLACK);

    // 新しい盤面では (2,3) に黒がある
    expect(newBoard.getDiscAt(target).equals(Disc.BLACK)).toBe(true);
    // 元の盤面は変わっていない（不変性の確認）
    expect(board.getDiscAt(target).equals(Disc.EMPTY)).toBe(true);
  });

  it('石を置いたとき、挟んだ相手の石がひっくり返ること', () => {
    const board = Board.createInitialBoard();
    // 初期配置: (3,3)=白, (4,3)=黒
    // (2,3)に黒を置くと、(3,3)の白がひっくり返るはず
    const target = new Coordinate(2, 3);
    const newBoard = board.move(target, Disc.BLACK);

    expect(newBoard.getDiscAt(new Coordinate(3, 3)).equals(Disc.BLACK)).toBe(true);
    expect(newBoard.getDiscAt(target).equals(Disc.BLACK)).toBe(true);
  });
});

describe('着手ルール (isLegalMove)', () => {
  it('石がある場所には置けないこと', () => {
    const board = Board.createInitialBoard();
    const c33 = new Coordinate(3, 3); // 最初から白がある
    expect(board.isLegalMove(c33, Disc.BLACK)).toBe(false);
  });

  it('相手の石を1つもひっくり返せない場所には置けないこと', () => {
    const board = Board.createInitialBoard();
    const c00 = new Coordinate(0, 0); // ここに置いても何も挟めない
    expect(board.isLegalMove(c00, Disc.BLACK)).toBe(false);
  });

  it('有効な場所であれば true を返すこと', () => {
    const board = Board.createInitialBoard();
    const c23 = new Coordinate(2, 3); // さっきテストした場所
    expect(board.isLegalMove(c23, Disc.BLACK)).toBe(true);
  });
});

describe('石のカウント (countDiscs)', () => {
  it('初期状態で黒2つ、白2つであること', () => {
    const board = Board.createInitialBoard();
    expect(board.countDiscs(Disc.BLACK)).toBe(2);
    expect(board.countDiscs(Disc.WHITE)).toBe(2);
  });

  it('石を置いた後、正しくカウントが更新されること', () => {
    const board = Board.createInitialBoard();
    // (2, 3) に黒を置くと、(3, 3) の白がひっくり返る
    // 黒: 2 -> 4 (置いた分 +1, ひっくり返した分 +1)
    // 白: 2 -> 1 (ひっくり返された分 -1)
    const newBoard = board.move(new Coordinate(2, 3), Disc.BLACK);
    expect(newBoard.countDiscs(Disc.BLACK)).toBe(4);
    expect(newBoard.countDiscs(Disc.WHITE)).toBe(1);
  });
});

describe('着手可能判定 (hasValidMove)', () => {
  it('初期状態で黒は置ける場所があること', () => {
    const board = Board.createInitialBoard();
    expect(board.hasValidMove(Disc.BLACK)).toBe(true);
  });

  it('初期状態で白は置ける場所があること', () => {
    const board = Board.createInitialBoard();
    expect(board.hasValidMove(Disc.WHITE)).toBe(true);
  });
  
  it('石が一つもない場所には置けないこと（特異な状況のテスト）', () => {
    // 全て空の盤面（本来ありえませんが）を作ってテスト
    const emptyBoard = new (Board as any)(new Map());
    expect(emptyBoard.hasValidMove(Disc.BLACK)).toBe(false);
  });
});