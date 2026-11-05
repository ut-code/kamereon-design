# kamereon-design

めっちゃカメレオンWeb のデザインキャンバス。画面を React で書いて大きなキャンバスに並べ、Figma のように動かして見る（`braille-daisy-poc/design` と同じ作り）。

```bash
npm install
npm run dev
```

## ファイル

- `src/main.jsx` … キャンバス。`screens` に画面と置く位置、`links` に画面どうしを結ぶ線（押す要素と開く要素をセレクターで指定）。線は画面の下にくぐらせ、画面と画面の間だけに見せる
- `src/tokens.css` … 色・枠・影・余白・フォントの基本の値
- `src/ui/` … B案・実装版の共通部品（Button / IconButton / TextButton / Panel / Tile / Chip / RankBadge / Heading / RankingList / ModeLabel / Steps / Stat / Dialog / Select / Checkbox / Range / TextInput / ColorInput / Divider）と、本体と同じ線画のアイコン（`icon.jsx`）
- `src/screens/b2.jsx` … B案・実装版のタイトル、ルール、パーツ表
- `src/screens/b2-find.jsx`・`b2-hide.jsx` … B案・実装版の見つける・隠すの画面（元の案と同じ画面構成）。画面の枠組みは `b2-common.jsx`、レイアウトは `b2-flow.css`
- `src/screens/b.jsx` … B案（元の案）のタイトル、ルール、パーツ表
- `src/screens/b-find.jsx` … B案（元の案）の見つける（ページ選択、選んだページ、スタート前、まだ誰も隠れていないとき、プレイ中、終了）。ページ選択は隠すでも使う
- `src/screens/b-hide.jsx` … B案（元の案）の隠す（体型選択、編集、遊び方、隠れた）
- `src/screens/b-common.jsx` … B案（元の案）の共通部品（背景、ステッカーのボタン、テープで留めた紙、ゲームの帯、人型、照準など）
- `public/sites/` … 遊ぶ Webページの画像。kamereon の `server/sites/` のページをヘッドレス Chrome で撮ったもの

## kamereon 本体へ持っていくもの

`src/tokens.css` と `src/ui/` をそのままコピーし、`Home.jsx` の見た目を `TitleB2` に合わせる。タイトル画面のレイアウトは `src/screens/b2.css` の `.b2-home` と `.b2-logo`。
ページ選択・体型選択・選んだページは `b2-find.jsx`・`b2-hide.jsx` と `b2-flow.css`、`Find.jsx`・`Hide.jsx` の帯とダイアログも同じファイルの `.b2-play`・`.b2-bar`・`Dialog` に合わせる。新しい画像は使わない（ページのプレビューは今の iframe のまま）。
