import { Coordinate } from './Coordinate'; 

describe('Coordinate (座標) 値オブジェクト', () => {

  // 異なるインスタンスでも、値が同じなら等しいことをテストする
  it('should be equal when two coordinates have the same x and y values', () => {
    const coord1 = new Coordinate(3, 5);
    const coord2 = new Coordinate(3, 5);
    
    // 値オブジェクトとして、=== (参照比較) ではなく、専用の equal メソッドで比較する
    expect(coord1.equals(coord2)).toBe(true);
  });

  // 値が異なれば、等しくないことをテストする
  it('should not be equal when two coordinates have different x or y values', () => {
    const coordA = new Coordinate(1, 2);
    const coordB = new Coordinate(2, 1);
    const coordC = new Coordinate(1, 3);

    expect(coordA.equals(coordB)).toBe(false);
    expect(coordA.equals(coordC)).toBe(false);
  });
});