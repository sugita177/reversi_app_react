import { Board } from './Board.ts';
import { Disc } from './Disc.ts';
import { Coordinate } from './Coordinate.ts';

export class Game {
  private readonly _board: Board;
  private readonly _currentPlayer: Disc;

  private constructor(board: Board, currentPlayer: Disc) {
    this._board = board;
    this._currentPlayer = currentPlayer;
  }

  public get board(): Board { return this._board; }
  public get currentPlayer(): Disc { return this._currentPlayer; }

  /**
   * ゲームの初期状態を生成する
   */
  public static createInitialGame(): Game {
    return new Game(Board.createInitialBoard(), Disc.BLACK);
  }

  /**
   * 指定した座標に石を打つ。成功すれば手番を交代した新しいGameを返す。
   */
  public play(coord: Coordinate): Game {
    // 1. ルール的に置けるかチェック
    if (!this._board.isLegalMove(coord, this._currentPlayer)) {
      throw new Error("Invalid move");
    }

    // 2. 盤面を更新
    const nextBoard = this._board.move(coord, this._currentPlayer);

    // 3. 次のプレイヤーを決定（基本は交代）
    const nextPlayer = this._currentPlayer.equals(Disc.BLACK) ? Disc.WHITE : Disc.BLACK;

    return new Game(nextBoard, nextPlayer);
  }

  /**
   * 現在のスコアを取得する
   */
  public get scores() {
    return {
      black: this._board.countDiscs(Disc.BLACK),
      white: this._board.countDiscs(Disc.WHITE)
    };
  }
}