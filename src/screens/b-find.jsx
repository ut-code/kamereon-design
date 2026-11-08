import { sites } from "./data.js"
import {
  Bare, Board, FigureIcon, FlashShadow, FlowHeader, Ground, Heading, Icon, Reticle, Slider, Slot, Stage, Sticker, Tab, asset, rotate,
} from "./b-common.jsx"

/*
 * B案の「見つける」の画面。ページ選択は「隠す」でも使う
 * 流れ：ページ選択 → 選んだページ → スタート前（モーダル）→ プレイ中 → 終了
 */

const siteTilts = [-1.5, 1.2, -0.8, 1.6, -1.1]
const siteTapes = ["rgba(46, 196, 182, .78)", "rgba(255, 126, 182, .8)", "rgba(197, 240, 74, .85)"]

/**
 * Webページを選ぶ。見つける・隠すで同じ画面を使い、mode で色を変える
 * 本体は SITES の5ページを並べる（4ページに満たないときだけ「準備中」で埋める）。隠すはここから直接、隠れる画面へ進む
 */
export function SiteSelectB({ mode }) {
  return (
    <div className="b-screen">
      <Ground />
      <main className="b-flow">
        <FlowHeader mode={mode} />
        <Heading>Webページを選ぶ</Heading>
        <p className="b-lead">{mode === "find" ? "カメレオンが潜んでいるページを選んでください" : "カメレオンを隠すページを選んでください"}</p>
        <div className="b-sites">
          {sites.map((site, index) => (
            <article key={site.id} className="b-site" style={rotate(siteTilts[index])}>
              <span className="b-site__tape" style={{ background: siteTapes[index % siteTapes.length], ...rotate(index % 2 ? 4 : -4) }} aria-hidden="true" />
              <img className="b-site__preview" src={asset(site.image)} alt="" />
              <h2>{site.title}</h2>
              <Sticker size="s" color={mode} tilt={index % 2 ? 2 : -2}>選択する →</Sticker>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

/** 選んだページの確認。写真のように貼ったページと「探しに行く」 */
export function FindReadyB() {
  const site = sites[0]
  return (
    <div className="b-screen">
      <Ground />
      <main className="b-flow">
        <FlowHeader mode="find" back="site" />
        <Heading>選んだWebページ</Heading>
        <div className="b-ready">
          <figure className="b-polaroid" style={rotate(-1.2)}>
            <span className="b-tape b-tape--left" style={{ background: "rgba(46, 196, 182, .78)" }} aria-hidden="true" />
            <span className="b-tape b-tape--right" style={{ background: "rgba(197, 240, 74, .85)" }} aria-hidden="true" />
            <img src={asset(site.image)} alt="" />
            <figcaption>{site.title}</figcaption>
          </figure>
          <div className="b-ready__side">
            <Sticker size="l" color="find" tilt={-2} className="b-ready__go">探しに行く →</Sticker>
          </div>
        </div>
      </main>
    </div>
  )
}

/** ゲームのページを開いたときのモーダル。ページの読み込みが終わると「スタート」を押せる */
export function FindIntroB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-intro-title" className="b-modal" tapes={["accent", "find"]}>
        <h2 id="b-intro-title" className="b-modal__title">カメレオンを探せ！</h2>
        <p>このページのどこかに、最大5体のカメレオンが潜んでいます。<br />見つけたらクリック！<br />照準を近づけると、カメレオンにうっすら影がつきます。</p>
        <div className="b-stats">
          <div style={{ background: "var(--find)", ...rotate(-2) }}><strong>最大5体</strong><span>潜んでいる</span></div>
          <div style={{ background: "var(--accent)", ...rotate(1.5) }}><strong>3:00</strong><span>制限時間</span></div>
          <div style={{ background: "var(--hide)", ...rotate(-1) }}><strong>−10秒</strong><span>デコイを押すと</span></div>
        </div>
        <p className="b-modal__note">クリックするたびに5秒間はクリックできません（当たり・外れ・デコイのどれでも）</p>
        <div className="b-modal__actions">
          <Sticker color="find" tilt={-2}>スタート</Sticker>
        </div>
      </Board>
    </Bare>
  )
}

/** 出題できるカメレオンがいないとき（自分が隠したものは出題しない）。スタート前のモーダルの代わりに出す */
export function FindEmptyB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-empty-title" className="b-modal" tapes={["hide", null]}>
        <h2 id="b-empty-title" className="b-modal__title">まだ誰も隠れていません</h2>
        <p>自分が隠したカメレオンは出題されません。<br />まずは隠すモードで隠れてみましょう。</p>
        <div className="b-modal__actions">
          <Sticker tilt={2}>ホームへ</Sticker>
          <Sticker color="hide" tilt={-2}>隠れる</Sticker>
        </div>
      </Board>
    </Bare>
  )
}

/** 見つける画面の上の帯。終わるとタイマーの代わりに結果、右にスコアと「もう一度」を出す */
function FindHud({ over = false }) {
  return (
    <header className="b-hud">
      <div className="b-hud__group">
        <Tab tilt={-2}>← ホーム</Tab>
        <span className="b-hud__mode">見つける</span>
        <span className="b-hud__zoom"><Icon name="search" /><Slider value={0} width={110} />100%</span>
      </div>
      {over ? (
        <span className="b-result" style={{ background: "var(--hide)", ...rotate(-2) }}>タイムアップ！</span>
      ) : (
        <div className="b-timer" style={rotate(-2)} role="timer" aria-label="残り2分14秒">
          <div className="b-timer__row"><span>残り</span><strong>2:14</strong></div>
          <div className="b-timer__bar"><span style={{ width: "74%" }} /></div>
        </div>
      )}
      <div className="b-hud__group b-hud__group--end">
        {!over && <span className="b-cooldown" title="クールタイム中はクリックできません"><Icon name="hourglass" size={16} />4秒</span>}
        <span className="b-found" role="img" aria-label="5体中3体発見">
          {[0, 1, 2, 3, 4].map((index) => <FigureIcon key={index} fill={index < 3 ? "#FF7EB6" : "#E2D8F5"} />)}
        </span>
        <span className="b-count">3<small>/5</small></span>
        {over ? (
          <>
            <span className="b-score"><span>スコア</span>327<small>点</small></span>
            <Sticker size="s" color="find" tilt={2}>もう一度</Sticker>
          </>
        ) : (
          <>
            <Tab pressed color="accent">発見済みを表示</Tab>
            <Tab tilt={2} className="b-hud__end">終了</Tab>
          </>
        )}
      </div>
    </header>
  )
}

// カメレオンの位置（ページの座標）と色。色はその場所の背景を上から4つの帯で拾った値（public/sites/utcode.jpg から測った）
export const chameleons = {
  wall: { x: 478, y: 508, colors: ["#F6F7F9", "#F9FAFC", "#F9FAFC", "#F9FAFC"], name: "かべの人" },
  ceiling: { x: 986, y: 300, colors: ["#B8B4A8", "#B3AFA4", "#AFABA1", "#AAA69C"], name: "擬態部長" },
  window: { x: 300, y: 128, colors: ["#92908A", "#9D9B96", "#B4B7C0", "#AAA8A2"], name: "まどぎわ" },
  right: { x: 1182, y: 150, colors: ["#B0ACA1", "#B7B3A7", "#BBB8AB", "#BCB8AB"], name: "ぬりえ名人" },
  desk: { x: 640, y: 640, colors: ["#2C2A2B", "#5D5352", "#2E303F", "#504D55"], name: "ノーマルK", pose: "crouch" },
}
export const decoys = {
  bags: { x: 292, y: 668, colors: ["#49464A", "#504D50", "#443F3F", "#3A3636"], owner: "擬態部長" },
  lights: { x: 820, y: 214, colors: ["#969185", "#94918A", "#9C9C9E", "#9A9B9C"], owner: "かべの人" },
}
export const aim = { x: 1004, y: 352 }

/** プレイ中。見つけたカメレオン（発見済みを表示中）、照準に照らされた影、押してしまったデコイ */
export function FindPlayB() {
  const { wall, ceiling } = chameleons
  return (
    <div className="b-game">
      <FindHud />
      <Stage>
        <Slot {...wall} state="found" label={wall.name} />
        <Slot {...ceiling}><FlashShadow x={ceiling.x} y={ceiling.y} aim={aim} /></Slot>
        <Slot {...decoys.bags} state="tripped" label={`デコイ（${decoys.bags.owner}）`} />
        <span className="b-pop" style={{ left: 268, top: 716, ...rotate(-4) }}>デコイ！ −10秒</span>
        <Reticle {...aim} />
      </Stage>
    </div>
  )
}

/** 終了（タイムアップ）。見つけたものは黄緑、見逃したものは桃色の輪で囲み、デコイも全部見せる */
export function FindOverB() {
  const found = ["wall", "right", "desk"]
  return (
    <div className="b-game">
      <FindHud over />
      <Stage>
        {Object.entries(chameleons).map(([key, c]) => (
          <Slot key={key} {...c} state={found.includes(key) ? "found" : "missed"} label={c.name} />
        ))}
        {Object.entries(decoys).map(([key, d]) => (
          <Slot key={key} {...d} state={key === "bags" ? "tripped" : "decoy"} label={`デコイ（${d.owner}）`} />
        ))}
      </Stage>
    </div>
  )
}
