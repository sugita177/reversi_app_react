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

  // 現在のプレイヤーが置ける座標を計算
  const puttableCoordinates = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const coord = new Coordinate(x, y);
      if (game.isPuttable(coord)) {
        puttableCoordinates.push(coord.toKey());
      }
    }
  }

  const { black, white, winner } = game.result;

  // パス判定
  const canPlay = puttableCoordinates.length > 0;
  const isPass = !game.isFinished && !canPlay;

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

      {/* パス通知エリア */}
      {isPass && (
        <div className="flex flex-col items-center gap-4 p-6 bg-orange-100 border-2 border-orange-400 rounded-lg shadow-md animate-in fade-in zoom-in duration-300">
          <p className="text-xl font-bold text-orange-800">
            {game.currentPlayer.equals(Disc.BLACK) ? "Black" : "White"} has no moves!
          </p>
          <button 
            onClick={() => setGame(game.skipTurn())}
            className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 shadow-lg transform hover:scale-105 transition-all"
          >
            Pass Turn
          </button>
        </div>
      )}

      {/* 盤面 */}
      <BoardView
        board={game.board}
        onSquareClick={handleSquareClick}
        puttableCoordinates={puttableCoordinates}
      />

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