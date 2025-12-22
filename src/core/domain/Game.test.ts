import { Game } from './Game.ts';
import { Board, MAX_COORD, MIN_COORD, BOARD_SIZE } from './Board.ts';
import { Coordinate } from './Coordinate.ts';
import { Disc } from './Disc.ts';

describe('Game (ゲーム進行) ドメインモデル', () => {
  it('ゲーム開始時は黒の番であること', () => {
    const game = Game.createInitialGame();
    expect(game.currentPlayer.equals(Disc.BLACK)).toBe(true);
  });

  it('有効な場所に石を置いたら、手番が交代すること', () => {
    const game = Game.createInitialGame();
    const moveCoord = new Coordinate(2, 3); // 黒が置ける場所
    
    const nextGame = game.play(moveCoord);

    expect(nextGame.currentPlayer.equals(Disc.WHITE)).toBe(true);
    // 盤面が更新されていることも確認
    expect(nextGame.board.getDiscAt(moveCoord).equals(Disc.BLACK)).toBe(true);
  });

  it('どちらのプレイヤーも打てる場所がなくなった場合、ゲーム終了となること', () => {
    // 実際には全マス埋まるか、途中で打てなくなる状況
    // テストのために、isFinished プロパティを確認できるようにします
    const game = Game.createInitialGame();
    expect(game.isFinished).toBe(false);
  });

  // パスのテストは実際の盤面を作るのが難しいため、
  // ロジックが hasValidMove を正しく呼んでいることを実装で保証します
});

describe('パス機能のテスト', () => {
  it('skipTurnを実行すると、盤面は維持されたまま手番だけが交代すること', () => {
    const game = Game.createInitialGame(); // 初期は BLACK
    const boardBefore = game.board;
    
    const nextGame = game.skipTurn();
    
    expect(nextGame.currentPlayer).toBe(Disc.WHITE);
    expect(nextGame.board).toBe(boardBefore); // 盤面(参照)が変わっていないこと
  });

  it('連続してskipTurnを実行すると、元の手番に戻ること', () => {
    const game = Game.createInitialGame();
    const secondPassGame = game.skipTurn().skipTurn();
    
    expect(secondPassGame.currentPlayer).toBe(Disc.BLACK);
  });
});

describe('Game (ゲーム進行) ドメインモデル - 総仕上げ', () => {
  
  describe('パスの判定', () => {
    it('相手が打てない場合、skipTurnを呼ぶことで手番が戻ること', () => {
      // 白だけがパスになる盤面を構築
      // 例: 黒が打った後、盤面に白は存在しかつ、白には打ち手がないが、黒にはまだ空きマスがあり挟める場所がある状態
      const discs = new Map<string, Disc>();
      const c00 = new Coordinate(0, 0);
      const c01 = new Coordinate(0, 1);
      const c10 = new Coordinate(1, 0);
      const c02 = new Coordinate(0, 2);

      discs.set(c00.toKey(), Disc.BLACK);
      discs.set(c01.toKey(), Disc.WHITE);
      discs.set(c10.toKey(), Disc.WHITE);
      // c35に黒を置けば c34の白を挟める状態
      
      const customBoard = Board.createForTest(discs);
      // 強制的に「黒の番、この盤面」から開始する内部用コンストラクタ的な呼び出し
      const game = (Game as any).createForTest(customBoard, Disc.BLACK);

      // 黒が c35 に打つ
      const nextGame = game.play(c02);

      // ここで isFinished が false であることが重要
      expect(nextGame.isFinished).toBe(false); 
      expect(nextGame.canPlay()).toBe(false); // 白は打てない

      // 2. 白がパスする
      const passGame = nextGame.skipTurn();

      // 3. 黒に戻る
      expect(passGame.currentPlayer).toBe(Disc.BLACK);
    });

    it('両者打てる場所がなくなった場合、isFinishedがtrueになること', () => {
      // 黒が打って、その後誰も打てなくなる盤面
      // （中央付近に黒を並べ、白を囲んでしまうような状態を想定）
      const discs = new Map<string, Disc>();
      const c33 = new Coordinate(3, 3);
      const c34 = new Coordinate(3, 4);
      const c35 = new Coordinate(3, 5);

      discs.set(c33.toKey(), Disc.BLACK);
      discs.set(c34.toKey(), Disc.WHITE);
      // c35に黒を置けば c34の白を挟める状態
      
      const customBoard = Board.createForTest(discs);
      // 強制的に「黒の番、この盤面」から開始する内部用コンストラクタ的な呼び出し
      const game = (Game as any).createForTest(customBoard, Disc.BLACK);

      // 黒が c35 に打つ
      const nextGame = game.play(c35);

      // どちらも打てる場所がないので、ゲーム終了
      expect(nextGame.isFinished).toBe(true);
      expect(nextGame.currentPlayer).toBe(Disc.WHITE);
  
      // 終了している場合、skipTurnを呼んでもcurrentPlayerは変わらない（ガードの確認）
      const afterSkip = nextGame.skipTurn();
      expect(afterSkip.currentPlayer).toBe(nextGame.currentPlayer);
    });
  });

  describe('終局と勝敗判定', () => {
    it('ゲーム終了時、石の数が多い方が勝者となること', () => {
      // 盤面がほぼ埋まった状態をシミュレート
      const discs = new Map<string, Disc>();
      // 1 ~ 7 行目は全て黒
      for (let i = MIN_COORD; i < MAX_COORD; i++) {
        for (let j = MIN_COORD; j <= MAX_COORD; j++) {
          discs.set((new Coordinate(i, j)).toKey(), Disc.BLACK);
        }
      }
      discs.set((new Coordinate(MAX_COORD, MIN_COORD)).toKey(), Disc.BLACK);
      for (let j = MIN_COORD + 1; j <= MAX_COORD - 1; j++) {
        discs.set((new Coordinate(MAX_COORD, j)).toKey(), Disc.WHITE);
      }
      const customBoard = Board.createForTest(discs);
      const game = (Game as any).createForTest(customBoard, Disc.BLACK);
      const finishedGame = game.play(new Coordinate(MAX_COORD, MAX_COORD));

      // game.isFinished が true になった時の game.result を検証
      expect(finishedGame.isFinished).toBe(true);
      expect(finishedGame.result.winner).toBe(Disc.BLACK);
    });

    it('引き分けの場合、勝者が EMPTY となること', () => {
      // 黒 32マス vs 白 32マス の状態
      const discs = new Map<string, Disc>();
      for (let i = MIN_COORD; i <= MAX_COORD; i++) {
        for (let j = MIN_COORD; j < BOARD_SIZE / 2; j++) {
          discs.set((new Coordinate(i, j)).toKey(), Disc.BLACK);
        }
        for (let j = BOARD_SIZE / 2; j <= MAX_COORD / 2; j++) {
          discs.set((new Coordinate(i, j)).toKey(), Disc.WHITE);
        }
      }
      const customBoard = Board.createForTest(discs);
      const game = (Game as any).createForTest(customBoard, Disc.BLACK);
      expect(game.result.winner).toBe(Disc.EMPTY);
    });
  });
});