import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoardView } from './BoardView.tsx';
import { Board } from '../core/domain/Board';
import { Coordinate } from '../core/domain/Coordinate';

describe('BoardView Component', () => {
  it('64個のマス目がレンダリングされること', () => {
    const board = Board.createInitialBoard();
    render(<BoardView board={board} onSquareClick={() => {}} puttableCoordinates={[]} />);
    
    // Squareコンポーネントで設定した data-testid="square" を探す
    const squares = screen.getAllByTestId('square');
    expect(squares).toHaveLength(64);
  });

  it('マスをクリックした時に、正しい座標が渡されること', () => {
    const board = Board.createInitialBoard();
    const handleSquareClick = vi.fn();
    render(<BoardView board={board} onSquareClick={handleSquareClick} puttableCoordinates={[]} />);
    
    const squares = screen.getAllByTestId('square');
    // 例えば左上(0, 0)のマスをクリック
    squares[0].click();
    
    expect(handleSquareClick).toHaveBeenCalledWith(expect.any(Coordinate));
    // 最初のマスが (0,0) であることを確認（実装のループ順序に依存）
    const calledCoord = handleSquareClick.mock.calls[0][0] as Coordinate;
    expect(calledCoord.toKey()).toBe("0,0");
  });

  it('指定された座標のマスにのみハイライトが適用されること', () => {
    const board = Board.createInitialBoard();
    // (2, 3) と (3, 2) を置ける場所として指定
    const puttableCoords = ["2,3", "3,2"]; 
    
    render(
      <BoardView 
        board={board} 
        onSquareClick={() => {}} 
        puttableCoordinates={puttableCoords} 
      />
    );
  
    const indicators = screen.getAllByTestId('puttable-indicator');
    
    // 指定した2箇所にインジケーターが出ているか
    expect(indicators).toHaveLength(2);
  });
});