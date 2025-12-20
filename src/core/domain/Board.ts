import { Coordinate, DIRECTIONS } from './Coordinate.ts';
import { Disc } from './Disc.ts';

export class Board {
  // 座標を文字列(例: "3,3")にして管理するMap
  private readonly discs: Map<string, Disc>;

  private constructor(discs: Map<string, Disc>) {
    this.discs = discs;
  }

  // 特定の座標の石を取得する
  public getDiscAt(coord: Coordinate): Disc {
    return this.discs.get(coord.toKey()) || Disc.EMPTY;
  }

  // 初期盤面を生成するファクトリメソッド
  public static createInitialBoard(): Board {
    const initialDiscs = new Map<string, Disc>();

    // 中央の4つをセット
    initialDiscs.set(new Coordinate(3, 3).toKey(), Disc.WHITE);
    initialDiscs.set(new Coordinate(3, 4).toKey(), Disc.BLACK);
    initialDiscs.set(new Coordinate(4, 3).toKey(), Disc.BLACK);
    initialDiscs.set(new Coordinate(4, 4).toKey(), Disc.WHITE);

    return new Board(initialDiscs);
  }

  public placeDisc(coord: Coordinate, disc: Disc): Board {
    // 現在の盤面配置をコピー
    const newDiscs = new Map(this.discs);
    // 新しい碁石を配置する
    newDiscs.set(coord.toKey(), disc);
    // 新しい盤面を新規オブジェクトとして返す
    return new Board(newDiscs);
  }

  /**
   * 石を置き、挟んだ石をひっくり返した新しい盤面を返す（着手）
   */
  public move(coord: Coordinate, disc: Disc): Board {
    // 1. 石を置く
    let nextDiscs = new Map(this.discs);
    nextDiscs.set(coord.toKey(), disc);

    // 2. 8方向に対してひっくり返せる石を探す
    DIRECTIONS.forEach(dir => {
      const flippedCoords = this.getFlippedCoordsInDirection(coord, dir.x, dir.y, disc);
      flippedCoords.forEach(c => {
        nextDiscs.set(c.toKey(), disc);
      });
    });

    return new Board(nextDiscs);
  }

  /**
   * 特定の方向でひっくり返る座標のリストを取得する（ヘルパーメソッド）
   */
  private getFlippedCoordsInDirection(start: Coordinate, dx: number, dy: number, myDisc: Disc): Coordinate[] {
    const candidates: Coordinate[] = [];
    let current = start.getNeighbor(dx, dy);

    while (current !== null) {
      const currentDisc = this.getDiscAt(current);
      
      // 空なら終了
      if (currentDisc.equals(Disc.EMPTY)) return [];
      
      // 自分の石に到達したら、それまで溜めた候補を返す
      if (currentDisc.equals(myDisc)) return candidates;
      
      // 相手の石なら候補に入れて、さらに先へ
      candidates.push(current);
      current = current.getNeighbor(dx, dy);
    }

    return []; // 盤面の端に到達した場合
  }

  /**
   * その座標に指定した色の石を置けるかどうかを判定する
   */
  public isLegalMove(coord: Coordinate, disc: Disc): boolean {
    // 1. すでに石がある場合は置けない
    if (!this.getDiscAt(coord).equals(Disc.EMPTY)) {
      return false;
    }

    // 2. 8方向のうち、1つでもひっくり返せる石があればOK
    return DIRECTIONS.some(dir => {
      const flipped = this.getFlippedCoordsInDirection(coord, dir.x, dir.y, disc);
      return flipped.length > 0;
    });
  }

  /**
   * 指定した色の石の数を数える
   */
  public countDiscs(disc: Disc): number {
    // this.discs (Map) をループしてカウントする
    let count = 0;
    this.discs.forEach((targetDisc) => {
        if (targetDisc === disc) count++;
    })
    return count;
  }

  /**
   * 指定した色の石が置ける場所が少なくとも1つあるか判定する
   */
  public hasValidMove(disc: Disc): boolean {
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        try {
          const coord = new Coordinate(i, j);
          if (this.isLegalMove(coord, disc) === true) {
            return true;
          }
        } catch (e) {
          // Coordinateの範囲外エラーは無視（通常ここには来ない）
          continue;
        }
      }
    }
    return false;
  }
} 