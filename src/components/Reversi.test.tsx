import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Reversi } from './Reversi';

describe('Reversi Component (Integration)', () => {
  it('初期状態で黒2枚、白2枚のスコアが表示されていること', () => {
    render(<Reversi />);
    // テキスト内容でスコア表示を探す
    expect(screen.getByText(/Black: 2/)).toBeInTheDocument();
    expect(screen.getByText(/White: 2/)).toBeInTheDocument();
  });

  it('有効なマスをクリックしたとき、石が置かれスコアが更新されること', () => {
    render(<Reversi />);
    
    // 初期状態で黒が打てる (2, 3) のマスを取得
    // BoardViewでSquareを並べている順序に依存しますが、
    // data-testid を工夫するか、全 square から特定のインデックスを指定します
    const squares = screen.getAllByTestId('square');
    
    // (2, 3) は 8 * 3 + 2 = 26 番目のインデックス（0開始）
    fireEvent.click(squares[26]);

    // 黒が1枚増え、白が1枚ひっくり返るので、黒:4, 白:1 になるはず
    expect(screen.getByText(/Black: 4/)).toBeInTheDocument();
    expect(screen.getByText(/White: 1/)).toBeInTheDocument();
  });

  it('リセットボタンを押すと初期状態に戻ること', () => {
    render(<Reversi />);
    const squares = screen.getAllByTestId('square');
    
    // 一手打つ
    fireEvent.click(squares[26]);
    expect(screen.getByText(/Black: 4/)).toBeInTheDocument();

    // リセット
    const resetButton = screen.getByText(/Reset Game/);
    fireEvent.click(resetButton);

    expect(screen.getByText(/Black: 2/)).toBeInTheDocument();
  });
});