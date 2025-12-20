import { Board } from './Board.ts';
import { Disc } from './Disc.ts';
import { Coordinate } from './Coordinate.ts';

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
   * 石を打つ。ルールに基づき、手番交代・パス・終局を判定する。
   */
  public play(coord: Coordinate): Game {
    if (this._isFinished) {
      throw new Error("Game is already finished");
    }

    if (!this._board.isLegalMove(coord, this._currentPlayer)) {
      throw new Error("Invalid move");
    }

    // 1. 石を置いてひっくり返す
    const nextBoard = this._board.move(coord, this._currentPlayer);
    
    // 2. 次のプレイヤー（相手）を決定
    const opponent = this.getOpponent(this._currentPlayer);

    // 3. 次のプレイヤー（相手）が打てる場所があるか？
    if (nextBoard.hasValidMove(opponent)) {
      // 相手が打てるなら、手番を交代して続行
      return new Game(nextBoard, opponent, false);
    }

    // 4. 相手は打てない。では、自分（現在のプレイヤー）はまだ打てる場所があるか？
    if (nextBoard.hasValidMove(this._currentPlayer)) {
      // 自分は打てるなら「パス」となり、手番は自分のまま続行
      return new Game(nextBoard, this._currentPlayer, false);
    }

    // 5. どちらも打てる場所がないなら、ゲーム終了
    return new Game(nextBoard, this._currentPlayer, true);
  }

  private getOpponent(disc: Disc): Disc {
    return disc.equals(Disc.BLACK) ? Disc.WHITE : Disc.BLACK;
  }

  /**
   * 現在のスコアと勝者を判定する（UI用）
   */
  public get result() {
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
}