// キャンバスで見せるための仮のランキング。名前も数値もサンプル
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
  { name: "かべの人", score: 92 },
  { name: "擬態部長", score: 88 },
  { name: "ノーマルK", score: 81 },
  { name: "ぬりえ名人", score: 79 },
  { name: "まどぎわ", score: 74 },
  { name: "しろいかべ", score: 70 },
  { name: "背景担当", score: 66 },
  { name: "こっそり", score: 61 },
  { name: "ふつうの人", score: 57 },
  { name: "はじめて", score: 52 },
]

// 遊べる Webページ。画像は kamereon の server/sites/ のページをヘッドレス Chrome で撮ったもの（public/sites/）
// 本体の SITES に入っているのは ut.code(); だけ。残りの2つは server/sites/ で作っている途中のページ
export const sites = [
  { id: "utcode", title: "ut.code(); ホームページ", image: "sites/utcode.jpg" },
  { id: "exhibit", title: "古今東西美術展", image: "sites/exhibit.jpg" },
  { id: "explore", title: "冒険", image: "sites/explore.jpg" },
]
