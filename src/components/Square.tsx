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

  return (
    <div
      onClick={onClick}
      className="w-full h-full bg-green-600 border border-green-800 flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors"
      data-testid="square"
    >
      {/* 石の表示（BLACK or WHITE の時だけ描画） */}
      {(isBlack || isWhite) && (
        <div
          className={`w-4/5 h-4/5 rounded-full shadow-md ${
            isBlack ? 'bg-black' : 'bg-white'
          }`}
          data-testid={isBlack ? 'black-disc' : 'white-disc'}
        />
      )}
      
      {/* 置ける場所のハイライト（石がない場合のみ） */}
      {!isBlack && !isWhite && isPuttable && (
        <div className="w-3 h-3 bg-black opacity-20 rounded-full" />
      )}
    </div>
  );
};