import React from 'react';
import { Board, BOARD_SIZE } from '../core/domain/Board';
import { Coordinate } from '../core/domain/Coordinate';
import { Square } from './Square';

interface BoardViewProps {
  board: Board;
  onSquareClick: (coord: Coordinate) => void;
  puttableCoordinates: string[];
}

export const BoardView: React.FC<BoardViewProps> = ({ board, onSquareClick, puttableCoordinates }) => {
  const squares = [];

  // 8x8のループを回してSquareを配置
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const coord = new Coordinate(x, y);
      const isPuttable = puttableCoordinates.includes(coord.toKey());
      squares.push(
        <div key={coord.toKey()} className="w-10 h-10 sm:w-12 sm:h-12">
          <Square
            disc={board.getDiscAt(coord)}
            onClick={() => onSquareClick(coord)}
            isPuttable={isPuttable}
          />
        </div>
      );
    }
  }

  return (
    <div 
      className="grid grid-cols-8 gap-0 border-4 border-green-900 bg-green-900 w-fit shadow-2xl"
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
    >
      {squares}
    </div>
  );
};