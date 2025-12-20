import React from 'react';
import { Disc } from '../core/domain/Disc';

interface SquareProps {
  disc: Disc;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ disc, onClick }) => {
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
    </div>
  );
};