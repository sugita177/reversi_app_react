import { Board } from './Board.ts';
import { Disc } from './Disc.ts';
import { Coordinate } from './Coordinate.ts';

export interface GameResult {
  black: number;
  white: number;
  winner: Disc;
}

export class Game {
  private readonly _board: Board;
  private readonly _currentPlayer: Disc;
  private readonly _isFinished: boolean;

  private constructor(board: Board, currentPlayer: Disc, isFinished: boolean) {
    this._board = board;
    this._currentPlayer = currentPlayer;
    this._isFinished = isFinished;
  }

  public get board(): Board { return this._board; }
  public get currentPlayer(): Disc { return this._currentPlayer; }
  public get isFinished(): boolean {return this._isFinished; }

  /**
   * ゲームの初期状態を生成する
   */
  public static createInitialGame(): Game {
    return new Game(Board.createInitialBoard(), Disc.BLACK, false);
  }

  /**
   * 石を打つ。
   * 打った後は「相手の手番」に切り替えて返す。
   */
  public play(coord: Coordinate): Game {
    if (this._isFinished) throw new Error("Game is already finished");
    if (!this.isPuttable(coord)) throw new Error("Invalid move");

    // 1. 石を置いて盤面を更新
    const nextBoard = this._board.move(coord, this._currentPlayer);
    
    // 2. 次のプレイヤー（相手）を決定
    const opponent = this.getOpponent(this._currentPlayer);

    // 3. 次の状態のGameインスタンスを生成して返す
    // ここでは単純に手番を交代させる（終局判定はコンストラクタか外部で行うのが綺麗）
    return new Game(nextBoard, opponent, this.calculateIsFinished(nextBoard, opponent));
  }

  /**
   * 手番をスキップする（明示的なパス）
   */
  public skipTurn(): Game {
    // すでに終了しているなら、状態を変えずに自分を返す
    if (this._isFinished) return this;
    const opponent = this.getOpponent(this._currentPlayer);
    return new Game(this._board, opponent, this.calculateIsFinished(this._board, opponent));
  }

  /**
   * どちらも打てる場所がない場合に終局とみなす
   */
  private calculateIsFinished(board: Board, nextPlayer: Disc): boolean {
    const opponent = this.getOpponent(nextPlayer);
    // 次のプレイヤーも、その次のプレイヤーも打てないなら終了
    return !board.hasValidMove(nextPlayer) && !board.hasValidMove(opponent);
  }

  private getOpponent(disc: Disc): Disc {
    return disc.equals(Disc.BLACK) ? Disc.WHITE : Disc.BLACK;
  }

  /**
   * 指定した座標に現在のプレイヤーが石を置けるか判定する
   */
  public isPuttable(coord: Coordinate): boolean {
    // すでに Board にある isLegalMove に、
    // 「今のプレイヤーの石の色」を渡すだけ
    return this._board.isLegalMove(coord, this._currentPlayer);
  }

  /**
   * 現在のプレイヤーが打てる場所があるか確認する
   */
  public canPlay(): boolean {
    return this._board.hasValidMove(this._currentPlayer);
  }
  
  /**
   * 現在のスコアと勝者を判定する（UI用）
   */
  public get result(): GameResult {
    const blackCount = this._board.countDiscs(Disc.BLACK);
    const whiteCount = this._board.countDiscs(Disc.WHITE);
    
    let winner = Disc.EMPTY;
    if (this._isFinished) {
      if (blackCount > whiteCount) winner = Disc.BLACK;
      else if (whiteCount > blackCount) winner = Disc.WHITE;
    }

    return {
      black: blackCount,
      white: whiteCount,
      winner: winner
    };
  }

  /**
   * テスト用に特定の状態からゲームを開始する
   */
  public static createForTest(board: Board, currentPlayer: Disc, isFinished: boolean = false): Game {
    return new Game(board, currentPlayer, isFinished);
  }
}