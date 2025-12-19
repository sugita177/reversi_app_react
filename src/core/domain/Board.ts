import { Coordinate } from './Coordinate.ts';
import { Disc } from './Disc.ts';

export class Board {
  // 座標を文字列(例: "3,3")にして管理するMap
  private readonly discs: Map<string, Disc>;

  private constructor(discs: Map<string, Disc>) {
    this.discs = discs;
  }

  // 特定の座標の石を取得する
  public getDiscAt(coord: Coordinate): Disc {
    const key = `${coord.x},${coord.y}`;
    return this.discs.get(key) || Disc.EMPTY;
  }

  // 初期盤面を生成するファクトリメソッド
  public static createInitialBoard(): Board {
    const initialDiscs = new Map<string, Disc>();

    // 中央の4つをセット
    initialDiscs.set('3,3', Disc.WHITE);
    initialDiscs.set('3,4', Disc.BLACK);
    initialDiscs.set('4,3', Disc.BLACK);
    initialDiscs.set('4,4', Disc.WHITE);

    return new Board(initialDiscs);
  }
}