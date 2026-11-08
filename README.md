# kamereon-design

めっちゃカメレオンWeb のデザインキャンバス。画面を React で書いて大きなキャンバスに並べ、Figma のように動かして見る（`braille-daisy-poc/design` と同じ作り）。

```bash
npm install
npm run dev
```

## ファイル

- `src/main.jsx` … キャンバス。`screens` に画面と置く位置、`links` に画面どうしを結ぶ線（押す要素と開く要素をセレクターで指定）。線は画面の下にくぐらせ、画面と画面の間だけに見せる
- `src/tokens.css` … 色・枠・影・余白・フォントの基本の値
- `src/screens/b.jsx` … B案のタイトル、ルール、パーツ表
- `src/screens/b-find.jsx` … B案の見つける（ページ選択、選んだページ、スタート前、まだ誰も隠れていないとき、プレイ中、終了）。ページ選択は隠すでも使う
- `src/screens/b-hide.jsx` … B案の隠す（体型選択、編集、遊び方、隠れた）
- `src/screens/b-common.jsx` … B案の共通部品（背景、ステッカーのボタン、テープで留めた紙、ゲームの帯、人型、照準など）
- `src/screens/icon.jsx` … 本体と同じ線画のアイコン
- `public/sites/` … 遊ぶ Webページの画像。kamereon の `server/sites/` のページをヘッドレス Chrome で撮ったもの
