import React, { useState } from 'react';
import { Game } from '../core/domain/Game';
import { BoardView } from './BoardView';
import { Coordinate } from '../core/domain/Coordinate';
import { Disc } from '../core/domain/Disc';

export const Reversi: React.FC = () => {
  // Game インスタンスを state として保持
  const [game, setGame] = useState(Game.createInitialGame());

  const handleSquareClick = (coord: Coordinate) => {
    try {
      // ドメインロジックを実行して新しい状態を取得
      const nextGame = game.play(coord);
      setGame(nextGame);
    } catch (e) {
      // 置けない場所をクリックした場合は何もしない（または警告を出す）
      console.error(e);
    }
  };

  const { black, white, winner } = game.result;

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800">Reversi App</h1>
      
      {/* ステータス表示 */}
      <div className="flex gap-8 text-xl font-semibold">
        <div className={`p-4 rounded shadow ${game.currentPlayer.equals(Disc.BLACK) ? 'bg-black text-white ring-4 ring-blue-500' : 'bg-white'}`}>
          Black: {black}
        </div>
        <div className={`p-4 rounded shadow ${game.currentPlayer.equals(Disc.WHITE) ? 'bg-white text-black ring-4 ring-blue-500' : 'bg-white'}`}>
          White: {white}
        </div>
      </div>

      {/* 盤面 */}
      <BoardView board={game.board} onSquareClick={handleSquareClick} />

      {/* ゲーム終了メッセージ */}
      {game.isFinished && (
        <div className="text-2xl font-bold text-red-600 animate-bounce">
          Game Over! Winner: {winner.toString()}
        </div>
      )}
      
      <button 
        onClick={() => setGame(Game.createInitialGame())}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Reset Game
      </button>
    </div>
  );
};