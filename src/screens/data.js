// キャンバスで見せるための仮のランキング。名前も数値もサンプル
// 隠れ上手は本体と同じく、評価3回以上のカメレオンの平均点（点）と、評価・出題・発見の回数を出す
export const findRanking = [
  { name: "ワシの目", score: 583 },
  { name: "みつけ屋", score: 561 },
  { name: "ぴよまる", score: 540 },
  { name: "ねこじゃらし", score: 522 },
  { name: "まちがい探し部", score: 507 },
  { name: "ルーペ", score: 498 },
  { name: "はやみみ", score: 476 },
  { name: "よーく見る人", score: 455 },
  { name: "スキャナー", score: 431 },
  { name: "ゆっくりさん", score: 402 },
]

export const hideRanking = [
  { name: "かべの人", score: 92, views: 14, searched: 17, found: 3 },
  { name: "擬態部長", score: 88, views: 11, searched: 12, found: 2 },
  { name: "ノーマルK", score: 81, views: 9, searched: 11, found: 4 },
  { name: "ぬりえ名人", score: 79, views: 8, searched: 9, found: 3 },
  { name: "まどぎわ", score: 74, views: 12, searched: 15, found: 6 },
  { name: "しろいかべ", score: 70, views: 6, searched: 8, found: 2 },
  { name: "背景担当", score: 66, views: 7, searched: 7, found: 4 },
  { name: "こっそり", score: 61, views: 5, searched: 6, found: 3 },
  { name: "ふつうの人", score: 57, views: 4, searched: 6, found: 2 },
  { name: "はじめて", score: 52, views: 3, searched: 4, found: 2 },
]

// 遊べる Webページ。本体の server/sites.js の SITES と同じ並びと名前
// 画像は kamereon の server/sites/ のページをヘッドレス Chrome で撮ったもの（public/sites/）
export const sites = [
  { id: "utcode", title: "ut.code(); ホームページ", image: "sites/utcode.jpg" },
  { id: "exhibit", title: "展覧会 ホームページ", image: "sites/exhibit.jpg" },
  { id: "explore", title: "探検 ホームページ", image: "sites/explore.jpg" },
  { id: "museum", title: "古今東西美術館 ホームページ", image: "sites/museum.jpg" },
  { id: "library", title: "水鏡文庫 ホームページ", image: "sites/library.jpg" },
]
