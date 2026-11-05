import { Button, ModeLabel, Steps, TextButton } from "../ui/ui.jsx"
import { FlashShadow, Silhouette, asset, camo } from "./b-common.jsx"
import "./b2-flow.css"

/*
 * B案・実装版の画面で使い回す枠組み（ホームから入る画面の帯・見出し、ゲームのページ、ページの上の目印）
 * 見た目の部品は ui.jsx。ここはその並べ方だけ
 */

/** ホームから入る画面（ページ選択・選んだページ・体型選択）の上の帯 */
export function PageHeader({ mode, step, back = "home" }) {
  return (
    <header className="b2-pagehead">
      <div className="b2-pagehead__group">
        <Button size="s">{back === "home" ? "← ホームへ" : "← ページ選択へ"}</Button>
        <ModeLabel mode={mode} />
        {step && <Steps items={["ページ", "体型"]} current={step} color={mode} />}
      </div>
      {back !== "home" && <TextButton className="b2-pagehead__home">ホームへ</TextButton>}
    </header>
  )
}

/** 画面の大見出し。白い帯に書く */
export function PageTitle({ children }) {
  return <h1 className="b2-title">{children}</h1>
}

/**
 * 遊ぶ Webページ。本体では iframe（SiteStage）で、キャンバスでは撮った画像で見せる
 * 中身はページの座標で置く
 */
export function Stage({ children }) {
  return (
    <div className="b2-stage">
      <div className="b2-stage__page">
        <img src={asset("sites/utcode.jpg")} alt="" width="1280" height="1000" />
        {children}
      </div>
    </div>
  )
}

/**
 * ページの上のカメレオン。人型は本体の figure.js が描くものと同じ形
 * state は found（見つけた）/ missed（見逃した）/ decoy（デコイ）/ tripped（押してしまったデコイ）/ editing・editing-decoy（隠す画面で編集中）
 * 目印はどれも四角い枠で、色と実線・破線だけで見分ける
 */
export function Mark({ x, y, state, label, pose, fill, colors, paint, shadow }) {
  return (
    <div className={`b2-mark${state ? ` b2-mark--${state}` : ""}`} style={{ left: x, top: y }}>
      {shadow && <FlashShadow x={x} y={y} aim={shadow} pose={pose} />}
      <Silhouette pose={pose} fill={colors ? colors[0] : fill} paint={colors ? camo(colors) : paint} />
      {label && <span className="b2-mark__label">{label}</span>}
    </div>
  )
}

/** デコイを押したときなどに一瞬だけ出す札。動きは付けず、出して消すだけ */
export function Pop({ x, y, children }) {
  return <span className="b2-pop" style={{ left: x, top: y }}>{children}</span>
}
