import React, { useState, useEffect, useMemo } from 'react';
import { Game } from '../core/domain/Game';
import { BoardView } from './BoardView';
import { Coordinate } from '../core/domain/Coordinate';
import { Disc } from '../core/domain/Disc';
import { GreedyStrategy } from '../core/domain/ai/GreedyStrategy';

type GameMode = 'PvP' | 'PvE';

export const Reversi: React.FC = () => {
  // Game インスタンスを state として保持
  const [game, setGame] = useState(Game.createInitialGame());
  const [gameMode, setGameMode] = useState<GameMode>('PvE');
  const ai = useMemo(() => new GreedyStrategy(), []);

  const { black, white, winner } = game.result;
  // 現在のプレイヤーが置ける座標を計算
  const puttableCoordinates = useMemo(() => {
    // Coordinate[] から string[] ("x,y" の形式) に変換する
    return game.getPuttableCoordinates().map(coord => coord.toKey());
  }, [game]);
  // パス判定
  const canPlay = puttableCoordinates.length > 0;
  const isPass = !game.isFinished && !canPlay;

  // AIの思考処理
  useEffect(() => {
    // コンピュータが打つべきタイミングを判定
    const isAiTurn = gameMode === 'PvE' && game.currentPlayer.equals(Disc.WHITE);
    
    if (!game.isFinished && isAiTurn) {
      const delay = isPass ? 1500 : 800; // パスの時は少し長めに表示を残す
      const timer = setTimeout(() => {
        if (isPass) {
          setGame(game.skipTurn());
        } else {
          const move = ai.computeMove(game);
          if (move) setGame(game.play(move));
        }
      }, delay); // 人間が目で追えるようにディレイを入れる
      return () => clearTimeout(timer);
    }
  }, [game, gameMode, ai, isPass]);

  const handleSquareClick = (coord: Coordinate) => {
    // AIの番の時は人間は打てない
    if (gameMode === 'PvE' && game.currentPlayer.equals(Disc.WHITE)) return;
    
    if (game.isPuttable(coord)) {
      setGame(game.play(coord));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-gray-100 min-h-screen overflow-hidden">
      {/* ヘッダーとモード選択を1行にまとめて高さを圧縮 */}
    <div className="flex items-center justify-between w-full max-w-sm px-2 mt-1">
      <h1 className="text-lg font-bold text-gray-800">Reversi App</h1>
      {/* モード切替UI */}
      <div className="flex bg-zinc-200 p-0.5 rounded-lg text-[10px] font-bold shadow-inner">
        <button 
          onClick={() => { setGameMode('PvP'); setGame(Game.createInitialGame()); }}
          className={`px-2 py-0.5 rounded cursor-pointer ${gameMode === 'PvP' ? 'bg-white shadow' : 'text-zinc-500'}`}
        >PvP (対人)</button>
        <button 
          onClick={() => { setGameMode('PvE'); setGame(Game.createInitialGame()); }}
          className={`px-2 py-0.5 rounded cursor-pointer ${gameMode === 'PvE' ? 'bg-white shadow' : 'text-zinc-500'}`}
        >PvE (対CPU)</button>
      </div>
    </div>

      <div className="flex gap-2 text-xs font-semibold">
      {/* Black スコア */}
      <div className={`flex items-center gap-2 p-1 px-3 rounded-lg shadow-sm transition-all ${
        game.currentPlayer.equals(Disc.BLACK) ? 'bg-zinc-800 text-white ring-2 ring-blue-400' : 'bg-zinc-100 text-zinc-400'
      }`}>
        <span>B: {black}</span>
      </div>
      {/* White スコア */}
      <div className={`flex items-center gap-2 p-1 px-3 rounded-lg shadow-sm transition-all ${
        game.currentPlayer.equals(Disc.WHITE) ? 'bg-zinc-50 text-black ring-2 ring-blue-400' : 'bg-zinc-100 text-zinc-400'
      }`}>
        <span>W: {white}</span>
      </div>
    </div>

      {/* 盤面親要素：ここを相対配置(relative)にして、パス通知を重ねる準備をする */}
      <div className="relative flex flex-col items-center gap-2 mt-2">
        {/* パス通知エリア */}
        {isPass && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-lg">
            <div className="bg-white p-3 rounded-lg shadow-xl border border-orange-400 flex flex-col items-center gap-2 animate-in zoom-in duration-200">
              <p className="text-sm font-bold text-orange-800">
                {game.currentPlayer.equals(Disc.BLACK) ? "Black" : "White"} Pass
              </p>
              {/* AIの番ならボタンを出さず、自動進行を待つ */}
              {!(gameMode === 'PvE' && game.currentPlayer.equals(Disc.WHITE)) && (
                <button 
                  onClick={() => setGame(game.skipTurn())}
                  className="px-4 py-1 text-xs bg-orange-500 text-white font-bold rounded-full cursor-pointer"
                >OK</button>
              )}
            </div>
          </div>
        )}
  
        {/* 盤面 */}
        <BoardView
          board={game.board}
          onSquareClick={handleSquareClick}
          puttableCoordinates={puttableCoordinates}
        />
  
        {/* 下部エリア：ゲーム終了とリセットボタンをコンパクトに */}
        <div className="flex flex-col items-center gap-2 mt-auto pb-4">
          {/* ゲーム終了メッセージ */}
          {game.isFinished && (
            <div className="text-2xl font-bold text-red-600 animate-bounce">
              Game Over! Winner: {winner.equals(Disc.BLACK) ? "Black" : winner.equals(Disc.WHITE) ? "White" : "Draw"}
            </div>
          )}
          
          <button 
            onClick={() => setGame(Game.createInitialGame())}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};