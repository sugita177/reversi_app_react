import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Square } from './Square';
import { Disc } from '../core/domain/Disc';

describe('Square Component', () => {
  it('黒石が指定された場合、黒い石が表示されること', () => {
    render(<Square disc={Disc.BLACK} onClick={() => {}} />);
    expect(screen.getByTestId('black-disc')).toBeInTheDocument();
  });

  it('白石が指定された場合、白い石が表示されること', () => {
    render(<Square disc={Disc.WHITE} onClick={() => {}} />);
    expect(screen.getByTestId('white-disc')).toBeInTheDocument();
  });

  it('空の場合、石が表示されないこと', () => {
    render(<Square disc={Disc.EMPTY} onClick={() => {}} />);
    expect(screen.queryByTestId('black-disc')).not.toBeInTheDocument();
    expect(screen.queryByTestId('white-disc')).not.toBeInTheDocument();
  });

  it('クリックされた時に onClick ハンドラが呼ばれること', () => {
    const handleClick = vi.fn();
    render(<Square disc={Disc.EMPTY} onClick={handleClick} />);
    
    const square = screen.getByTestId('square');
    fireEvent.click(square);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});