export default {
  // Jestのルートディレクトリ
  rootDir: '.',

  // テストファイルを検索するルートディレクトリ
  roots: ['<rootDir>/src'],
  
  // テストファイルのパターン (*.test.ts, *.spec.ts を検出)
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  
  // Jest実行環境の設定
  // ドメインロジックのテストなので 'node' で十分
  testEnvironment: 'node', 

  // .js, .jsx, .ts, .tsx の全てを babel-jest に通す
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', 
  },

  // モジュールの解決（.ts, .tsx を含む）
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Jestが無視するディレクトリ
  transformIgnorePatterns: [
    '/node_modules/', // デフォルトの無視パターン
  ],
};