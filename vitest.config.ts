import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Reactプラグインが必要な場合

export default defineConfig({
  plugins: [react()],
  test: {
    // ブラウザ環境をシミュレートする
    environment: 'jsdom',
    // 各テストファイルで 'describe', 'it', 'expect' を明示的にインポートせずに使えるようにする場合（任意）
    globals: true,
    // jest-dom のマッチャー（toBeInTheDocumentなど）を使えるようにするセットアップファイル
    setupFiles: './src/test/setup.ts',
  },
});