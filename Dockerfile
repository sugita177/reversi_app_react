# Dockerfile
# ベースイメージとして Node.js 24 の軽量版を使用
FROM node:24-alpine

# 作業ディレクトリを設定
WORKDIR /app

# ローカルの package.json と package-lock.json をコンテナ内にコピー
# このステップで、ローカルで定義した React, TypeScript, Jest などの依存関係のリストが読み込まれる
COPY package*.json ./

# 依存関係をインストール
# このステップで全てのライブラリがコンテナ内部にインストールされる
RUN npm install

# 残りのソースコードをコピー
COPY . .

# 開発サーバーが使用するポートを公開 (Vite/Reactのデフォルト)
EXPOSE 3000

# コンテナ起動時のデフォルトコマンドを設定
# docker-compose.yamlで上書きされることを想定
CMD ["npm", "run", "dev"]