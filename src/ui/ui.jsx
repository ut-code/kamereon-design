import { useState } from "react"
import "./ui.css"

/*
 * B案・実装版の共通部品。どの画面もこの部品の組み合わせで作る
 * color は find / hide / white / sub / accent の5つ。背景色は ui-bg-* のクラスで付ける
 * 入力欄（Select / Checkbox / Range / TextInput / ColorInput）はブラウザの部品に枠と色を付けるだけ
 */

/** ボタン。size は l（モード選択）/ m（画面の主な操作）/ s（ヘッダー・タブ）。タブも size="s" のボタンで作る */
export function Button({ color = "white", size = "m", className = "", children, ...props }) {
  return (
    <button type="button" className={`ui-btn ui-btn--${size} ui-bg-${color} ${className}`} {...props}>
      {children}
    </button>
  )
}

/** アイコンだけの四角いボタン。label は読み上げ用 */
export function IconButton({ label, color = "white", className = "", children, ...props }) {
  return (
    <Button size="s" color={color} className={`ui-btn--icon ${className}`} aria-label={label} title={label} {...props}>
      {children}
    </Button>
  )
}

/** 文字だけのボタン（「4位以下」など） */
export function TextButton({ className = "", children, ...props }) {
  return (
    <button type="button" className={`ui-link ${className}`} {...props}>
      {children}
    </button>
  )
}

/** 白い紙のパネル。ランキングやダイアログの土台 */
export function Panel({ as: Tag = "section", className = "", children, ...props }) {
  return (
    <Tag className={`ui-panel ${className}`} {...props}>
      {children}
    </Tag>
  )
}

/** タイトルの文字タイル。color="camo" は背景に溶け込んだタイル */
export function Tile({ color = "white", size = "l", children }) {
  const look = color === "camo" ? "ui-tile--camo" : `ui-bg-${color}`
  return <span className={`ui-tile ui-tile--${size} ${look}`}>{children}</span>
}

/** 「準備中」などの小さなラベル */
export function Chip({ children }) {
  return <span className="ui-chip">{children}</span>
}

/** 順位や手順の番号を入れる四角 */
export function RankBadge({ rank, color = "sub" }) {
  return <span className={`ui-badge ui-bg-${color}`}>{rank}</span>
}

/** 色の四角が付いた小見出し。見つける・隠すの区別に使う */
export function Heading({ color, children }) {
  return (
    <h3 className="ui-heading">
      <span className={`ui-heading__mark ui-bg-${color}`} aria-hidden="true" />
      {children}
    </h3>
  )
}

const emptyText = { soon: "準備中", loading: "読み込み中", empty: "記録はまだありません" }

/**
 * ランキングの1列。上位3名を出し、「4位以下」で10名まで開く
 * state が ready 以外のときは、表の代わりに emptyText の文言だけを出す
 */
export function RankingList({ title, color, unit, entries, state = "ready", expanded = false }) {
  const [open, setOpen] = useState(expanded)
  const visible = entries.slice(0, open ? 10 : 3)
  return (
    <div className="ui-ranking">
      <div className="ui-ranking__head">
        <Heading color={color}>{title}</Heading>
        {state === "ready" && entries.length > 3 && (
          <TextButton aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "上位3名だけ" : "4位以下"}
          </TextButton>
        )}
      </div>
      {state === "ready" ? (
        <ol className="ui-ranking__list">
          {visible.map((entry, index) => (
            <li className="ui-ranking__row" key={entry.name}>
              <RankBadge rank={index + 1} color={index === 0 ? color : "sub"} />
              <span className="ui-ranking__name">{entry.name}</span>
              <span className="ui-ranking__score">
                {entry.score}
                <small>{unit}</small>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="ui-ranking__empty">{emptyText[state]}</p>
      )}
    </div>
  )
}

const modeNames = { find: "見つける", hide: "隠す" }

/** モードの名前の札。見つけるは黄緑、隠すは桃色 */
export function ModeLabel({ mode }) {
  return <span className={`ui-mode ui-bg-${mode}`}>{modeNames[mode]}</span>
}

/** 手順の表示。今の手順だけ番号に色を付ける */
export function Steps({ items, current, color = "hide" }) {
  return (
    <ol className="ui-steps" aria-label={`${items.length}ステップ中${current}`}>
      {items.map((item, index) => (
        <li key={item} aria-current={index + 1 === current ? "step" : undefined}>
          <RankBadge rank={index + 1} color={index + 1 === current ? color : "sub"} />
          {item}
        </li>
      ))}
    </ol>
  )
}

/** 色の付いた箱に大きな数字と短い説明。ルールの要点（5人・3分・−10秒）に使う */
export function Stat({ color, value, label }) {
  return (
    <div className={`ui-stat ui-bg-${color}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

/**
 * ダイアログ。見出し・本文・下のボタンの3段。onClose を渡すと右上に × を出す
 * 本体では <dialog> に入れて showModal() で開き、::backdrop に .ui-backdrop と同じ色を付ける
 */
export function Dialog({ id, title, onClose, actions, className = "", children }) {
  return (
    <Panel as="div" role="dialog" aria-modal="true" aria-labelledby={id} className={`ui-dialog ${className}`}>
      <div className="ui-dialog__head">
        <h2 id={id}>{title}</h2>
        {onClose && <Button size="s" color="sub" aria-label="閉じる" onClick={onClose}>×</Button>}
      </div>
      {children}
      {actions && <div className="ui-dialog__foot">{actions}</div>}
    </Panel>
  )
}

/** 選択欄。右端の ▾ は CSS で付ける */
export function Select({ className = "", children, ...props }) {
  return (
    <span className={`ui-select ${className}`}>
      <select {...props}>{children}</select>
    </span>
  )
}

export function Checkbox({ children, ...props }) {
  return (
    <label className="ui-check">
      <input type="checkbox" {...props} />
      {children}
    </label>
  )
}

/** つまみを滑らせる入力。color="hide" でつまみを桃色にする（ペンの太さ） */
export function Range({ color = "ink", className = "", ...props }) {
  return <input type="range" className={`ui-range ui-range--${color} ${className}`} {...props} />
}

export function TextInput({ className = "", ...props }) {
  return <input type="text" className={`ui-input ${className}`} {...props} />
}

export function ColorInput({ className = "", ...props }) {
  return <input type="color" className={`ui-color ${className}`} {...props} />
}

/** ツールバーの区切りの縦線 */
export function Divider() {
  return <span className="ui-divider" aria-hidden="true" />
}
