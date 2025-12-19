import { Game } from './Game.ts';
import { Board } from './Board.ts';
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
});