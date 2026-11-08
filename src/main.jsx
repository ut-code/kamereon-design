import { StrictMode, useLayoutEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { PartsB, RulesB, TitleB } from "./screens/b.jsx"
import { FindEmptyB, FindIntroB, FindOverB, FindPlayB, FindReadyB, SiteSelectB } from "./screens/b-find.jsx"
import { HideEditB, HideHelpB, HidePaintB, HideSavedB, HideTimeUpB } from "./screens/b-hide.jsx"
import "./tokens.css"
import "./canvas.css"

// 大見出し
const sections = [
  { name: "B案", x: 0, y: 0 },
]

// 行。上からルール、タイトルと見つける、隠す、パーツと隠すの遊び方
const rowB = { rules: 140, find: 800, hide: 1904, extra: 3008 }

// height を省くと 900。null にすると中身の高さに合わせる
// bare は枠を付けずに中身だけを置く（モーダルだけを見せるときなど）
const screens = [
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
  // 隠すはページを選ぶとそのまま隠れる画面へ進む。体型は隠れる画面の帯で選ぶ
  { id: "b-hide-site", name: "隠す 1: ページ選択", x: 1600, y: rowB.hide, Screen: () => <SiteSelectB mode="hide" /> },
  { id: "b-hide-edit", name: "隠す 2: 編集（移動）", x: 3200, y: rowB.hide, Screen: HideEditB },
  { id: "b-hide-paint", name: "隠す 2: 編集（「塗る」で開く色塗り・ポーズのダイアログ）", x: 4800, y: rowB.hide, Screen: HidePaintB },
  { id: "b-hide-saved", name: "隠す 3: 隠れた（モーダル）", x: 6400, y: rowB.hide, width: 640, height: null, bare: true, Screen: HideSavedB },
  // 5分たつと押さずに出るので線は結ばない
  { id: "b-hide-timeup", name: "隠す: タイムアップ（5分たつと出るモーダル）", x: 7200, y: rowB.hide, width: 640, height: null, bare: true, Screen: HideTimeUpB },
  { id: "b-parts", name: "パーツ", x: 0, y: rowB.extra, width: 800, height: null, Screen: PartsB },
  // 遊び方は編集の「？」の真下に置き、線をまっすぐ下へ引く
  { id: "b-hide-help", name: "隠す: 遊び方（「？」で開くモーダル）", x: 3200, y: rowB.extra, width: 760, height: null, bare: true, Screen: HideHelpB },
]


// ボタンを押して画面が変わる・モーダルが開くところだけを結ぶ線（時間切れや道具の切り替えのような、押さずに変わる・同じ画面の中の変化は結ばない）。座標は書かず、セレクターで要素を探して描いた後に測る
// side は押す要素のどの辺から線を出すか。right（省略時）は右の画面へ、top・bottom は上下の画面へ
const links = [
  { from: ["b-title", ".b-home__rules"], to: ["b-rules", ".b-modal"], side: "top" },
  { from: ["b-title", ".b-mode:first-child"], to: ["b-find-site", ".b-sites"] },
  { from: ["b-title", ".b-mode:last-child"], to: ["b-hide-site", ".b-sites"], side: "bottom" },
  { from: ["b-find-site", ".b-site:first-child .b-sticker"], to: ["b-find-ready", ".b-polaroid"] },
  // 「探しに行く」は、出題できるカメレオンがいればスタート前、いなければ「まだ誰も隠れていません」
  { from: ["b-find-ready", ".b-ready__go"], to: ["b-find-intro", ".b-modal"] },
  { from: ["b-find-ready", ".b-ready__go"], to: ["b-find-empty", ".b-modal"] },
  { from: ["b-find-intro", ".b-modal__actions .b-sticker"], to: ["b-find-play", ".b-stage"] },
  { from: ["b-hide-site", ".b-site:first-child .b-sticker"], to: ["b-hide-edit", ".b-stage"] },
  { from: ["b-hide-edit", ".b-tool--pen"], to: ["b-hide-paint", ".b-paint"] },
  { from: ["b-hide-edit", ".b-help"], to: ["b-hide-help", ".b-modal"], side: "bottom" },
  { from: ["b-hide-paint", ".b-save"], to: ["b-hide-saved", ".b-modal"] },
]

const size = { width: 8740, height: 4300 }

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
