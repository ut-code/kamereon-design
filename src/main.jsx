import { StrictMode, useLayoutEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { PartsB, RulesB, TitleB } from "./screens/b.jsx"
import { FindEmptyB, FindIntroB, FindOverB, FindPlayB, FindReadyB, SiteSelectB } from "./screens/b-find.jsx"
import { HideBodyB, HideEditB, HideHelpB, HideSavedB } from "./screens/b-hide.jsx"
import { PartsB2, RulesPanel, TitleB2 } from "./screens/b2.jsx"
import { FindEmptyB2, FindIntroB2, FindOverB2, FindPlayB2, FindReadyB2, SiteSelectB2 } from "./screens/b2-find.jsx"
import { HideBodyB2, HideEditB2, HideHelpB2, HideSavedB2 } from "./screens/b2-hide.jsx"
import "./tokens.css"
import "./canvas.css"

// 案ごとの大見出しの高さ。実装版の下に元の案を置く
const top = { b2: 0, b: 5300 }

// 案ごとの大見出し
const sections = [
  { name: "B案・実装版（2週間で作り切る版）", x: 0, y: top.b2 },
  { name: "B案（元の案）", x: 0, y: top.b },
]

// 案の中の行。上からルール、タイトルと見つける、隠す、パーツと隠すの遊び方。実装版と元の案で同じ並びにする
const rowsAt = (y) => ({ rules: y + 140, find: y + 800, hide: y + 1904, extra: y + 3008 })
const rowB2 = rowsAt(top.b2)
const rowB = rowsAt(top.b)

// height を省くと 900。null にすると中身の高さに合わせる
// bare は枠を付けずに中身だけを置く（モーダルだけを見せるときなど）
const screens = [
  // ルールのダイアログはタイトルの「？ ルール」の真上に置き、線をまっすぐ上へ引く
  { id: "b2-rules", name: "ルール（オーバーレイで開くダイアログ）", x: 600, y: rowB2.rules, width: 720, height: null, bare: true, Screen: () => <div className="b2-screen b2-screen--bare"><RulesPanel /></div> },
  { id: "b2-title", name: "タイトル", x: 0, y: rowB2.find, Screen: () => <TitleB2 /> },
  { id: "b2-find-site", name: "見つける 1: ページ選択", x: 1600, y: rowB2.find, Screen: () => <SiteSelectB2 mode="find" /> },
  { id: "b2-find-ready", name: "見つける 2: 選んだページ", x: 3200, y: rowB2.find, Screen: FindReadyB2 },
  // 「探しに行く」の高さにスタート前を置いて線を水平にし、まだ誰も隠れていないときはその上に置く
  { id: "b2-find-intro", name: "見つける 3: スタート前（ダイアログ）", x: 4800, y: rowB2.find + 373, width: 640, height: null, bare: true, Screen: FindIntroB2 },
  { id: "b2-find-empty", name: "見つける 3: まだ誰も隠れていないとき（ダイアログ）", x: 4800, y: rowB2.find, width: 640, height: null, bare: true, Screen: FindEmptyB2 },
  { id: "b2-find-play", name: "見つける 4: プレイ中", x: 5600, y: rowB2.find, Screen: FindPlayB2 },
  { id: "b2-find-over", name: "見つける 5: 終了（タイムアップ）", x: 7200, y: rowB2.find, Screen: FindOverB2 },
  { id: "b2-hide-site", name: "隠す 1: ページ選択", x: 1600, y: rowB2.hide, Screen: () => <SiteSelectB2 mode="hide" /> },
  { id: "b2-hide-body", name: "隠す 2: 体型選択", x: 3200, y: rowB2.hide, Screen: HideBodyB2 },
  { id: "b2-hide-edit", name: "隠す 3: 編集（移動）", x: 4800, y: rowB2.hide, Screen: () => <HideEditB2 tool="move" /> },
  { id: "b2-hide-paint", name: "隠す 3: 編集（ペンで塗る）", x: 6400, y: rowB2.hide, Screen: () => <HideEditB2 tool="pen" /> },
  { id: "b2-hide-saved", name: "隠す 4: 隠れた（ダイアログ）", x: 8000, y: rowB2.hide, width: 640, height: null, bare: true, Screen: HideSavedB2 },
  { id: "b2-parts", name: "パーツと実装メモ", x: 0, y: rowB2.extra, width: 800, height: null, Screen: PartsB2 },
  // 遊び方は編集の「？」の真下に置き、線をまっすぐ下へ引く
  { id: "b2-hide-help", name: "隠す: 遊び方（「？」で開くダイアログ）", x: 4800, y: rowB2.extra, width: 720, height: null, bare: true, Screen: HideHelpB2 },

  // ルールのモーダルはタイトルの「？ ルール」の真上に置き、線をまっすぐ上へ引く
  { id: "b-rules", name: "ルール（オーバーレイで開くモーダル）", x: 600, y: rowB.rules, width: 840, height: null, bare: true, Screen: RulesB },
  { id: "b-title", name: "タイトル", x: 0, y: rowB.find, Screen: TitleB },
  { id: "b-find-site", name: "見つける 1: ページ選択", x: 1600, y: rowB.find, Screen: () => <SiteSelectB mode="find" /> },
  { id: "b-find-ready", name: "見つける 2: 選んだページ", x: 3200, y: rowB.find, Screen: FindReadyB },
  // 「探しに行く」の高さにスタート前を置いて線を水平にし、まだ誰も隠れていないときはその上に置く
  { id: "b-find-intro", name: "見つける 3: スタート前（モーダル）", x: 4800, y: rowB.find + 373, width: 640, height: null, bare: true, Screen: FindIntroB },
  { id: "b-find-empty", name: "見つける 3: まだ誰も隠れていないとき（モーダル）", x: 4800, y: rowB.find, width: 640, height: null, bare: true, Screen: FindEmptyB },
  { id: "b-find-play", name: "見つける 4: プレイ中", x: 5600, y: rowB.find, Screen: FindPlayB },
  { id: "b-find-over", name: "見つける 5: 終了（タイムアップ）", x: 7200, y: rowB.find, Screen: FindOverB },
  { id: "b-hide-site", name: "隠す 1: ページ選択", x: 1600, y: rowB.hide, Screen: () => <SiteSelectB mode="hide" /> },
  { id: "b-hide-body", name: "隠す 2: 体型選択", x: 3200, y: rowB.hide, Screen: HideBodyB },
  { id: "b-hide-edit", name: "隠す 3: 編集（移動）", x: 4800, y: rowB.hide, Screen: () => <HideEditB tool="move" /> },
  { id: "b-hide-paint", name: "隠す 3: 編集（ペンで塗る）", x: 6400, y: rowB.hide, Screen: () => <HideEditB tool="pen" /> },
  { id: "b-hide-saved", name: "隠す 4: 隠れた（モーダル）", x: 8000, y: rowB.hide, width: 640, height: null, bare: true, Screen: HideSavedB },
  { id: "b-parts", name: "パーツ", x: 0, y: rowB.extra, width: 800, height: null, Screen: PartsB },
  // 遊び方は編集の「？」の真下に置き、線をまっすぐ下へ引く
  { id: "b-hide-help", name: "隠す: 遊び方（「？」で開くモーダル）", x: 4800, y: rowB.extra, width: 760, height: null, bare: true, Screen: HideHelpB },
]


// ボタンを押して画面が変わる・モーダルが開くところだけを結ぶ線（時間切れや道具の切り替えのような、押さずに変わる・同じ画面の中の変化は結ばない）。座標は書かず、セレクターで要素を探して描いた後に測る
// side は押す要素のどの辺から線を出すか。right（省略時）は右の画面へ、top・bottom は上下の画面へ
const links = [
  { from: ["b2-title", ".b2-home__header .ui-btn"], to: ["b2-rules", ".ui-dialog"], side: "top" },
  { from: ["b2-title", ".b2-home__modes .ui-btn:first-child"], to: ["b2-find-site", ".b2-sites"] },
  { from: ["b2-title", ".b2-home__modes .ui-btn:last-child"], to: ["b2-hide-site", ".b2-sites"], side: "bottom" },
  { from: ["b2-find-site", ".b2-site:first-child .ui-btn"], to: ["b2-find-ready", ".b2-flow"] },
  // 「探しに行く」は、出題できるカメレオンがいればスタート前、いなければ「まだ誰も隠れていません」
  { from: ["b2-find-ready", ".b2-ready__go"], to: ["b2-find-intro", ".ui-dialog"] },
  { from: ["b2-find-ready", ".b2-ready__go"], to: ["b2-find-empty", ".ui-dialog"] },
  { from: ["b2-find-intro", ".ui-dialog__foot .ui-btn"], to: ["b2-find-play", ".b2-stage"] },
  { from: ["b2-hide-site", ".b2-site:first-child .ui-btn"], to: ["b2-hide-body", ".b2-flow"] },
  { from: ["b2-hide-body", ".b2-body__go"], to: ["b2-hide-edit", ".b2-stage"] },
  { from: ["b2-hide-edit", ".b2-help"], to: ["b2-hide-help", ".ui-dialog"], side: "bottom" },
  { from: ["b2-hide-paint", ".b2-save"], to: ["b2-hide-saved", ".ui-dialog"] },

  { from: ["b-title", ".b-home__rules"], to: ["b-rules", ".b-modal"], side: "top" },
  { from: ["b-title", ".b-mode:first-child"], to: ["b-find-site", ".b-sites"] },
  { from: ["b-title", ".b-mode:last-child"], to: ["b-hide-site", ".b-sites"], side: "bottom" },
  { from: ["b-find-site", ".b-site:first-child .b-sticker"], to: ["b-find-ready", ".b-polaroid"] },
  // 「探しに行く」は、出題できるカメレオンがいればスタート前、いなければ「まだ誰も隠れていません」
  { from: ["b-find-ready", ".b-ready__go"], to: ["b-find-intro", ".b-modal"] },
  { from: ["b-find-ready", ".b-ready__go"], to: ["b-find-empty", ".b-modal"] },
  { from: ["b-find-intro", ".b-modal__actions .b-sticker"], to: ["b-find-play", ".b-stage"] },
  { from: ["b-hide-site", ".b-site:first-child .b-sticker"], to: ["b-hide-body", ".b-flow"] },
  { from: ["b-hide-body", ".b-body__go"], to: ["b-hide-edit", ".b-stage"] },
  { from: ["b-hide-edit", ".b-help"], to: ["b-hide-help", ".b-modal"], side: "bottom" },
  { from: ["b-hide-paint", ".b-save"], to: ["b-hide-saved", ".b-modal"] },
]

const size = { width: 8740, height: 9600 }

/** キャンバスの中での位置。拡大・縮小の影響を受けない offset の値を、キャンバスの枠まで足し上げる */
function offsetIn(el, root) {
  let x = 0
  let y = 0
  for (let node = el; node && node !== root; node = node.offsetParent) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return { x, y }
}

/** 要素の四辺（キャンバスの座標） */
function box(el, root) {
  const { x, y } = offsetIn(el, root)
  return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 }
}

/**
 * 線の通る点。線は画面の下に描くので、押した要素から自分の画面の端までは画面に隠れて見えない
 * right：押した要素の右端から、開く画面の左端へ。開く要素の高さの中なら水平に、外なら画面と画面の間で曲げて開く要素の真ん中へ
 * top・bottom：押した要素の上（下）端から、真上（真下）の開く画面へ。真上（真下）に無ければ、開く要素の高さまで進んでから右へ曲げる
 */
function route(a, b, side, root) {
  const from = box(a, root)
  const to = box(b, root)
  const frame = box(b.closest(".canvas__frame"), root)
  if (side === "top" || side === "bottom") {
    const start = { x: from.cx, y: side === "top" ? from.top : from.bottom }
    if (start.x >= to.left && start.x <= to.right) return [start, { x: start.x, y: side === "top" ? frame.bottom : frame.top }]
    return [start, { x: start.x, y: to.cy }, { x: frame.left, y: to.cy }]
  }
  const start = { x: from.right, y: from.cy }
  const end = { x: frame.left, y: start.y >= to.top && start.y <= to.bottom ? start.y : to.cy }
  if (end.y === start.y) return [start, end]
  const mid = (box(a.closest(".canvas__frame"), root).right + frame.left) / 2
  return [start, { x: mid, y: start.y }, { x: mid, y: end.y }, end]
}

/** 折れ線の角を丸くした path */
function roundedPath(points, radius = 24) {
  let d = `M${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const [p, q, n] = [points[i - 1], points[i], points[i + 1]]
    const r = Math.min(radius, Math.hypot(q.x - p.x, q.y - p.y) / 2, Math.hypot(n.x - q.x, n.y - q.y) / 2)
    const toward = (a, b) => ({ x: a.x + (Math.sign(b.x - a.x) * r), y: a.y + (Math.sign(b.y - a.y) * r) })
    const before = toward(q, p)
    const after = toward(q, n)
    d += ` L${before.x} ${before.y} Q${q.x} ${q.y} ${after.x} ${after.y}`
  }
  const last = points[points.length - 1]
  return `${d} L${last.x} ${last.y}`
}

function Canvas() {
  const ref = useRef(null)
  const [lines, setLines] = useState([])

  useLayoutEffect(() => {
    const root = ref.current
    const measure = () =>
      setLines(
        links.flatMap(({ from, to, side = "right" }) => {
          const a = root.querySelector(`[data-screen="${from[0]}"] ${from[1]}`)
          const b = root.querySelector(`[data-screen="${to[0]}"] ${to[1]}`)
          if (!a || !b) return []
          return [route(a, b, side, root)]
        }),
      )
    measure()
    // Web フォントが届くと文字の幅が変わるので測り直す
    document.fonts.ready.then(measure)
  }, [])

  return (
    <div ref={ref} className="canvas" style={size}>
      {sections.map(({ name, x, y }) => (
        <h1 key={name} className="canvas__section" style={{ left: x, top: y }}>{name}</h1>
      ))}
      {/* 線は画面より先に描き、画面の下にくぐらせる。押す要素と開く先の点は画面の上に出す */}
      <svg className="canvas__links" aria-hidden="true">
        {lines.map((points) => <path key={points.map(({ x, y }) => `${x},${y}`).join(" ")} d={roundedPath(points)} />)}
      </svg>
      {screens.map(({ id, name, x, y, width = 1440, height = 900, bare = false, Screen }) => (
        <section key={id} data-screen={id} className="canvas__screen" style={{ left: x, top: y }}>
          <h2 className="canvas__title">{name}</h2>
          <div className={bare ? "canvas__frame canvas__frame--bare" : "canvas__frame"} style={{ width, height: height ?? "auto" }}>
            <Screen />
          </div>
        </section>
      ))}
      <svg className="canvas__links canvas__links--dots" aria-hidden="true">
        {lines.map((points) => [points[0], points[points.length - 1]]).flat().map(({ x, y }, index) => (
          <circle key={`${index}:${x},${y}`} cx={x} cy={y} r={6} />
        ))}
      </svg>
    </div>
  )
}

// スマホではキャンバスの操作を使わず、ブラウザのスクロールとピンチで見る
const touch = matchMedia("(pointer: coarse)").matches

// 操作の設定は braille-daisy-poc/design と同じ。ドラッグで移動し、ホイールかピンチで拡大・縮小する
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {touch ? (
      <div className="canvas-touch">
        <Canvas />
      </div>
    ) : (
      <TransformWrapper limitToBounds={false} minScale={0.05} fitOnInit wheel={{ step: 0.001 }}>
        <TransformComponent infinite wrapperClass="canvas-wrapper" wrapperStyle={{ width: "100vw", height: "100vh" }} contentStyle={size}>
          <Canvas />
        </TransformComponent>
      </TransformWrapper>
    )}
  </StrictMode>,
)
