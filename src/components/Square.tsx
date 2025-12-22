import React from 'react';
import { Disc } from '../core/domain/Disc';

interface SquareProps {
  disc: Disc;
  onClick: () => void;
  isPuttable?: boolean;
}

export const Square: React.FC<SquareProps> = ({ disc, onClick, isPuttable }) => {
  // Discの種類に応じたスタイル
  const isBlack = disc.equals(Disc.BLACK);
  const isWhite = disc.equals(Disc.WHITE);
  const isEmpty = disc.equals(Disc.EMPTY);

  return (
    <div
      onClick={onClick}
      className="w-full h-full bg-green-600 border border-green-800 flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors"
      data-testid="square"
    >
      {/* 石のアニメーションコンテナ （BLACK or WHITE の時だけ描画）*/}
      <div 
        className={`relative w-4/5 h-4/5 transition-transform duration-500 ease-in-out`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isWhite ? 'rotateY(180deg)' : 'rotateY(0deg)',
          opacity: isEmpty ? 0 : 1
        }}
        data-testid={isBlack ? 'black-disc' : isWhite ? 'white-disc' : undefined}
      >
        {/* 黒い面 (表面) */}
        <div 
          className="absolute inset-0 bg-black rounded-full shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        />
        
        {/* 白い面 (裏面 - あらかじめ180度回転させておく) */}
        <div 
          className="absolute inset-0 bg-white rounded-full shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
        />
      </div>

      {/* 置ける場所のハイライト (既存) */}
      {isEmpty && isPuttable && (
        <div 
          className="absolute w-3 h-3 bg-black opacity-20 rounded-full animate-pulse" 
          data-testid="puttable-indicator"
        />
      )}
    </div>
  );
};