import { useId } from "react"
import "./b.css"
import "./b-flow.css"

/*
 * B案の共通部品。タイトル以外の画面もこの部品で組む
 * 指針：紫の地に葉っぱと人型を散らす／ボタンは白い縁のステッカーを少し傾けて貼る／
 * 紙（白い板）はテープで留める／角丸は使わず、影は真下にずらした濃い紫
 */

export const rotate = (deg) => ({ transform: `rotate(${deg}deg)` })

/** public/ の画像。ビルドの base が "./" でも開けるように BASE_URL を付ける */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

/** カクカクした人型（ロゴ・アイコン用）。viewBox は 0 0 88 168 */
export const figurePath = "M32 4H56V28H62V40L70 92H60L58 60V88H62V166H48V96H40V166H26V88H30V60L28 92H18L26 40V28H32Z"

const leaves = [
  [-20, 90, -20, 1.6, "light"], [40, 270, 25, 1.2, "dark"], [-10, 520, -35, 1.8, "light"], [70, 770, 10, 1.4, "dark"],
  [300, 30, -8, 1, "dark"], [220, 850, -15, 1.2, "light"], [1130, 70, 200, 1.6, "light"], [1290, 250, 160, 1.3, "dark"],
  [1200, 500, 215, 1.9, "light"], [1300, 730, 170, 1.5, "dark"], [930, 20, 190, 1.1, "dark"], [1040, 860, 195, 1.3, "light"],
]
export const leafColor = { light: "#7B50E3", dark: "#5C31BE" }

/** 紫の地に散らす葉っぱと、葉っぱに紛れた人型 */
export function Ground() {
  return (
    <svg className="b-bg" viewBox="0 0 1280 860" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {leaves.map(([x, y, deg, scale, tone]) => (
        <path key={`${x},${y}`} d="M0 0L64 -34L170 -6L76 30Z" transform={`translate(${x} ${y}) rotate(${deg}) scale(${scale})`} fill={leafColor[tone]} />
      ))}
      <path d={figurePath} transform="translate(120 360) rotate(-6) scale(0.62)" fill={leafColor.light} />
      <path d={figurePath} transform="translate(1110 600) rotate(5) scale(0.56)" fill={leafColor.dark} />
    </svg>
  )
}

/** 白い縁のステッカーのボタン。size は l（タイトルのモード）/ m / s */
export function Sticker({ as: Tag = "button", color = "paper", size = "m", tilt = 0, className = "", style, children, ...props }) {
  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      className={`b-sticker b-sticker--${size} ${className}`}
      style={{ background: `var(--${color})`, ...rotate(tilt), ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** 小さい札のボタン。pressed を渡すと切り替えボタンになり、押されていない間は薄紫 */
export function Tab({ pressed, color = "paper", tilt = 0, className = "", children, ...props }) {
  const off = pressed === false
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`b-tab${off ? " b-tab--off" : ""} ${className}`}
      style={{ ...(off ? null : { background: `var(--${color})` }), ...rotate(tilt) }}
      {...props}
    >
      {children}
    </button>
  )
}

const tapeColor = { accent: "rgba(46, 196, 182, .78)", hide: "rgba(255, 126, 182, .8)", find: "rgba(197, 240, 74, .85)" }

/** テープで留めた紙。tapes は左上・右上のテープの色 */
export function Board({ as: Tag = "section", tilt = -0.6, tapes = ["accent", "hide"], className = "", children, ...props }) {
  return (
    <Tag className={`b-board ${className}`} style={rotate(tilt)} {...props}>
      {tapes[0] && <span className="b-tape b-tape--left" style={{ background: tapeColor[tapes[0]] }} aria-hidden="true" />}
      {tapes[1] && <span className="b-tape b-tape--right" style={{ background: tapeColor[tapes[1]] }} aria-hidden="true" />}
      {children}
    </Tag>
  )
}

/** 紙の帯に書いた大見出し */
export function Heading({ tilt = -1.5, children }) {
  return <h1 className="b-heading" style={rotate(tilt)}>{children}</h1>
}

/** 見つける・隠すの色の付いた札。モードの名前に使う */
export function ModeTag({ mode, tilt = 2 }) {
  return <span className="b-modetag" style={{ background: `var(--${mode})`, ...rotate(tilt) }}>{mode === "find" ? "見つける" : "隠す"}</span>
}

/** ホームから入る画面（ページ選択・体型選択・選んだページ）の上の帯 */
export function FlowHeader({ mode, step, back = "home" }) {
  return (
    <header className="b-flowhead">
      <div className="b-flowhead__group">
        <Sticker size="s" tilt={-2}>{back === "home" ? "← ホームへ" : "← ページ選択へ"}</Sticker>
        <ModeTag mode={mode} />
        {step && (
          <ol className="b-steps" aria-label={`2ステップ中${step}`}>
            {["ページ", "体型"].map((name, index) => (
              <li key={name} aria-current={index + 1 === step ? "step" : undefined}><span>{index + 1}</span>{name}</li>
            ))}
          </ol>
        )}
      </div>
      {back !== "home" && <a className="b-textlink" href="#home">ホームへ</a>}
    </header>
  )
}

export { Icon } from "./icon.jsx"

/**
 * 体型の見本。本体の Home.jsx の BodyPreview と同じ形（丸い頭・首・角の丸い胴・腕・脚）
 * body は { id, width, limb }。脚の開きは本体と同じく細め 8・標準 12・太め 16
 */
export function BodyPreview({ body }) {
  const left = 44 - body.width / 2
  const right = 44 + body.width / 2
  const legSpread = body.id === "round" ? 16 : body.id === "slim" ? 8 : 12
  return (
    <svg width="116" height="220" viewBox="0 0 88 168" aria-hidden="true" focusable="false">
      <g fill="currentColor" stroke="currentColor" strokeLinecap="round">
        <circle cx="44" cy="16" r="12" stroke="none" />
        <path d="M44 24V36" strokeWidth="9" />
        <rect x={left} y="30" width={body.width} height="58" rx={body.id === "round" ? 18 : 9} stroke="none" />
        <path d={`M${left - 3} 38L${left - 9} 90M${right + 3} 38L${right + 9} 90`} strokeWidth={body.limb} />
        <path d={`M${44 - legSpread} 82V156M${44 + legSpread} 82V156`} strokeWidth={body.limb + 1} />
      </g>
    </svg>
  )
}

/** カクカクした人型の小さいアイコン（残りの数など） */
export function FigureIcon({ fill, width = 16, height = 30 }) {
  return <svg width={width} height={height} viewBox="0 0 88 168" aria-hidden="true"><path d={figurePath} fill={fill} /></svg>
}

// ゲームの人型。本体の figure.js の POSES と同じ形（72×160 の座標を 0.8 倍で表示する）
const poses = {
  stand: { head: [36, 15, 12], torso: [22, 28, 28, 56, 10], limbs: [[36, 22, 36, 32, 9], [19, 34, 12, 88, 10], [53, 34, 60, 88, 10], [30, 80, 28, 152, 12], [42, 80, 44, 152, 12]] },
  banzai: { head: [36, 27, 11], torso: [23, 39, 26, 52, 10], limbs: [[36, 33, 36, 42, 9], [26, 45, 11, 7, 10], [46, 45, 61, 7, 10], [30, 86, 28, 153, 12], [42, 86, 44, 153, 12]] },
  crouch: { head: [34, 75, 12], torso: [18, 86, 32, 44, 12], limbs: [[34, 82, 34, 92, 9], [22, 94, 40, 122, 10], [46, 94, 58, 124, 10], [26, 124, 50, 112, 13], [50, 112, 54, 153, 12], [26, 128, 22, 153, 12]] },
}
export const FIG_W = 58
export const FIG_H = 128

function PoseShape({ pose, color }) {
  const { head: [cx, cy, r], torso: [x, y, w, h, rx], limbs } = poses[pose]
  return (
    <g fill={color} stroke={color} strokeLinecap="round">
      <circle cx={cx} cy={cy} r={r} stroke="none" />
      <rect x={x} y={y} width={w} height={h} rx={rx} stroke="none" />
      {limbs.map(([x1, y1, x2, y2, t]) => <line key={`${x1},${y1},${x2}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={t} />)}
    </g>
  )
}

/** 塗れる人型。paint に渡した図形は人型の形で切り抜く（塗りかけの様子に使う） */
export function Silhouette({ pose = "stand", fill = "#FFFFFF", paint, className, style }) {
  const id = `fig${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg className={className} style={style} width={FIG_W} height={FIG_H} viewBox="0 0 72 160" aria-hidden="true">
      {paint ? (
        <>
          <defs><mask id={id}><PoseShape pose={pose} color="#FFFFFF" /></mask></defs>
          <g mask={`url(#${id})`}>
            <rect width="72" height="160" fill={fill} />
            {paint}
          </g>
        </>
      ) : (
        <PoseShape pose={pose} color={fill} />
      )}
    </svg>
  )
}

/** 上から順に帯で塗る（背景の色を上・中・下で拾って塗った想定）。colors は人型の高さを等分した帯の色 */
export function camo(colors) {
  const band = 160 / colors.length
  return <>{colors.map((color, index) => <rect key={index} y={index * band} width="72" height={band + 1} fill={color} />)}</>
}

/**
 * ページの上のカメレオン。colors を渡すと背景に合わせて帯で塗る。state は found（見つけた）/ missed（見逃した）/ decoy（デコイ）/ tripped（押してしまったデコイ）/
 * editing・editing-decoy（隠す画面で編集中の枠）
 */
export function Slot({ x, y, state, label, pose, fill, colors, paint, children }) {
  return (
    <div className={`b-slot${state ? ` b-slot--${state}` : ""}`} style={{ left: x, top: y }}>
      {children}
      <Silhouette pose={pose} fill={colors ? colors[0] : fill} paint={colors ? camo(colors) : paint} />
      {label && <span className="b-slot__label">{label}</span>}
    </div>
  )
}

/** 照準に照らされた影。本体の Find.jsx と同じ計算で、照準の円の中だけに出す */
export function FlashShadow({ x, y, aim, pose, radius = 48 }) {
  const vx = x + FIG_W / 2 - aim.x
  const vy = y + FIG_H / 2 - aim.y
  const dist = Math.hypot(vx, vy)
  const len = 4 + Math.min(dist * 0.15, 10)
  const dx = (vx / dist) * len
  const dy = (vy / dist) * len
  return (
    <Silhouette
      pose={pose}
      fill="#000000"
      className="b-slot__shadow"
      style={{ left: dx, top: dy, clipPath: `circle(${radius}px at ${aim.x - x - dx}px ${aim.y - y - dy}px)` }}
    />
  )
}

/** 照準。直径 100px の円と破線の十字（本体のカーソルと同じ大きさ） */
export function Reticle({ x, y }) {
  return (
    <svg className="b-reticle" style={{ left: x - 50, top: y - 50 }} width="100" height="100" viewBox="0 0 50 50" aria-hidden="true">
      <g fill="none">
        <circle cx="25" cy="25" r="24" stroke="rgba(42, 22, 80, .55)" strokeWidth="2.4" />
        <circle cx="25" cy="25" r="24" stroke="var(--find)" strokeWidth="1.2" />
        <path d="M25 1V49M1 25H49" stroke="var(--find)" strokeWidth="1" strokeDasharray="4 3" />
      </g>
    </svg>
  )
}

/** 遊ぶ Webページ（ut.code(); のホームページを撮った画像）。中身はページの座標で置く */
export function Stage({ scrollY = 0, children }) {
  return (
    <div className="b-stage">
      <div className="b-stage__page" style={{ top: -scrollY }}>
        <img src={asset("sites/utcode.jpg")} alt="" width="1280" height="1000" />
        {children}
      </div>
    </div>
  )
}

/** 横に滑らせるつまみ。キャンバスで見せるだけなので動かない */
export function Slider({ value, color = "find", width = 120 }) {
  return (
    <span className="b-slider" style={{ width }} aria-hidden="true">
      <span className="b-slider__fill" style={{ width: `${value * 100}%`, background: `var(--${color})` }} />
      <span className="b-slider__thumb" style={{ left: `${value * 100}%`, background: `var(--${color})` }} />
    </span>
  )
}

/** モーダルだけをキャンバスに置くときの外側。文字の設定だけ持ち、背景は付けない */
export function Bare({ children }) {
  return <div className="b-bare">{children}</div>
}
