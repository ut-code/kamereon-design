import { sites } from "./data.js"
import {
  Bare, BodyPreview, Board, FigureIcon, FlowHeader, Ground, Heading, Icon, Slider, Slot, Stage, Sticker, Tab, asset, rotate,
} from "./b-common.jsx"

/*
 * B案の「隠す」の画面。ページ選択は b-find.jsx の SiteSelectB を mode="hide" で使う
 * 流れ：ページ選択 → 体型選択 → 編集（移動・ペン）→ 隠れた（モーダル）。編集の「？」で遊び方のモーダル
 */

// 本体の Home.jsx の BODY_OPTIONS と同じ（width は胴の幅、limb は手足の太さ）。今は標準だけ選べる
export const bodies = [
  { id: "slim", label: "細め", width: 18, limb: 8, spread: 7, ready: false, tilt: -2 },
  { id: "standard", label: "標準", width: 28, limb: 10, spread: 10, ready: true, tilt: 1.5 },
  { id: "round", label: "太め", width: 48, limb: 14, spread: 14, ready: false, tilt: -1 },
]

/** 体型を選ぶ（2ステップ目）。選んだ体型は桃色のステッカーになる */
export function HideBodyB() {
  const site = sites[0]
  return (
    <div className="b-screen">
      <Ground />
      <main className="b-flow">
        <FlowHeader mode="hide" step={2} back="site" />
        <Heading>体型を選ぶ</Heading>
        <div className="b-selected-site" style={rotate(-1)}>
          <img src={asset(site.image)} alt="" />
          選んだページ：{site.title}
        </div>
        <fieldset className="b-bodies">
          <legend className="b-sr-only">カメレオンの体型</legend>
          {bodies.map((body) => {
            const selected = body.id === "standard"
            return (
              <label key={body.id} className={`b-body${selected ? " b-body--on" : ""}${body.ready ? "" : " b-body--soon"}`} style={rotate(body.tilt)}>
                <input className="b-sr-only" type="radio" name="b-body" defaultChecked={selected} disabled={!body.ready} />
                <BodyPreview body={body} />
                <strong>{body.label}</strong>
                <span className="b-body__state">{selected ? "● 選択中" : <span className="b-chip">準備中</span>}</span>
              </label>
            )
          })}
        </fieldset>
        <div className="b-flowfoot">
          <p>今は標準の体型だけ遊べます</p>
          <Sticker color="hide" tilt={-2} className="b-body__go">編集へ →</Sticker>
        </div>
      </main>
    </div>
  )
}

export const tools = [
  ["move", "移動", "ドラッグで移動（矢印キーで1pxずつ）"],
  ["pen", "ペン", "重ねて塗るほど少し暗く・鮮やかになります"],
  ["eraser", "消しゴム", "白に戻します"],
]

/** 隠す画面の上の帯。上の段は移動と保存、下の段は塗る道具と人型。ペンと消しゴムの間だけ色と太さを出す */
function HideToolbar({ tool, name }) {
  return (
    <header className="b-tools">
      <div className="b-tools__row">
        <div className="b-hud__group">
          <Tab tilt={-2}>← ホーム</Tab>
          <span className="b-hud__mode"><span className="b-hud__mark" style={{ background: "var(--hide)" }} />隠す</span>
          <button type="button" className="b-help" style={rotate(4)} aria-label="隠すモードの遊び方">?</button>
        </div>
        <div className="b-hud__group">
          <span className="b-select"><Icon name="search" size={16} />100%<Icon name="chevron" size={16} /></span>
          <span className="b-check"><span className="b-check__box"><Icon name="check" size={16} /></span>枠を表示</span>
          <span className="b-tools__sep" />
          <Tab className="b-tab--icon" aria-label="元に戻す"><Icon name="undo" /></Tab>
          <Tab className="b-tab--icon" aria-label="やり直す"><Icon name="redo" /></Tab>
          <span className="b-tools__sep" />
          <span className={`b-input${name ? "" : " b-input--empty"}`}>{name || "カメレオンの名前"}</span>
          <Sticker size="s" color="hide" tilt={-2} className="b-save">ここに隠れる！</Sticker>
        </div>
      </div>
      <div className="b-tools__row">
        <div className="b-hud__group">
          {tools.map(([key, label]) => (
            <Tab key={key} pressed={tool === key} color="hide" className={`b-tool--${key}`}><Icon name={key} />{label}</Tab>
          ))}
          {tool !== "move" && (
            <>
              <span className="b-tools__sep" />
              {tool === "pen" && (
                <>
                  <span className="b-swatch" style={{ background: "#76757C" }} title="rgb(118, 117, 124)" />
                  <Tab><Icon name="eyedropper" />スポイト</Tab>
                  <Tab><Icon name="fill" />全体塗り</Tab>
                </>
              )}
              <span className="b-size">太さ<Slider value={0.22} color="hide" width={100} />6</span>
            </>
          )}
        </div>
        <div className="b-hud__group">
          <span className="b-select">ポーズ: 直立<Icon name="chevron" size={16} /></span>
          <Tab className="b-tab--icon" aria-label="左に回す"><Icon name="rotateLeft" /></Tab>
          <Tab>0°</Tab>
          <Tab className="b-tab--icon" aria-label="右に回す"><Icon name="rotateRight" /></Tab>
          <span className="b-tools__sep" />
          <Tab><Icon name="decoy" />デコイを追加 1/3</Tab>
        </div>
      </div>
    </header>
  )
}

export const main = { x: 760, y: 470 }
export const decoy = { x: 1010, y: 352 }

// 塗りかけの本体。ペンで背景の色を拾い、上から塗っている途中（色は public/sites/utcode.jpg のこの場所から測った）
export const paint = (
  <>
    <rect width="72" height="40" fill="#B4D8DE" />
    <rect y="40" width="72" height="40" fill="#7E9190" />
    <path d="M0 80H72V92C60 98 52 88 40 96S18 100 0 94Z" fill="#76757C" />
  </>
)

/** 編集。tool が move なら置いた直後の白い人型、pen なら塗りかけの人型と色・太さの設定 */
export function HideEditB({ tool = "move" }) {
  const pen = tool === "pen"
  return (
    <div className="b-game">
      <HideToolbar tool={tool} name={pen ? "かべの人" : ""} />
      <div className="b-hint">
        <strong>本体を編集中</strong>
        位置: ({main.x}, {main.y})
        <span>／　デコイをクリックした人は残り時間が減ります</span>
      </div>
      <Stage>
        <Slot {...main} state="editing" label="本体" paint={pen ? paint : undefined} />
        <Slot {...decoy} state="editing-decoy" label="デコイ1" />
        {pen ? (
          <svg className="b-cursor" style={{ left: main.x + 34 - 12, top: main.y + 84 - 12 }} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <path d="M12 0V7M12 17V24M0 12H7M17 12H24" stroke="var(--ink)" strokeWidth="1.5" />
          </svg>
        ) : (
          <span className="b-cursor b-cursor--move" style={{ left: main.x + 18, top: main.y + 46 }}><Icon name="move" size={26} /></span>
        )}
      </Stage>
    </div>
  )
}

/** 編集の「？」で開く遊び方 */
export function HideHelpB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-help-title" className="b-modal" tapes={["hide", "accent"]}>
        <div className="b-modal__head">
          <h2 id="b-help-title" className="b-modal__title">隠すモードの遊び方</h2>
          <Tab tilt={3} aria-label="閉じる">×</Tab>
        </div>
        <p>人型のカメレオンをページのどこかに置き、背景になじむように色を塗って隠しましょう。「ここに隠れる！」を押すと保存され、見つけるモードで他の人に探してもらえます。</p>
        <h3>ツール</h3>
        <dl className="b-help-tools">
          {tools.map(([key, label, hint], index) => (
            <div key={key}>
              <dt><Tab color="sub" tilt={index % 2 ? 1.5 : -1.5}><Icon name={key} />{label}</Tab></dt>
              <dd>{hint}</dd>
            </div>
          ))}
        </dl>
        <h3>その他</h3>
        <ul className="b-help-list">
          <li>ポーズを選んだり、左右の回転ボタンで回したりできます</li>
          <li>デコイ（ニセモノ）を3体まで置けます。デコイをクリックした人は残り時間が減ります</li>
          <li>Ctrl+Z で元に戻す、Ctrl+Shift+Z でやり直す。矢印キーは Shift を押しながらだと10pxずつ動きます</li>
        </ul>
        <div className="b-modal__actions">
          <Sticker color="hide" tilt={-2}>閉じる</Sticker>
        </div>
      </Board>
    </Bare>
  )
}

/** 「ここに隠れる！」で保存したあと */
export function HideSavedB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-saved-title" className="b-modal" tapes={["hide", "find"]}>
        <div className="b-saved__head">
          <span style={rotate(-6)}><FigureIcon fill="#FF7EB6" width={34} height={64} /></span>
          <h2 id="b-saved-title" className="b-modal__title">隠れました！</h2>
        </div>
        <p>「かべの人」がページに潜みました。デコイ 1 体も置きました。<br />何人に探され、何人に見つかったかはホームで確かめられます。</p>
        <div className="b-modal__actions">
          <Sticker tilt={2}>もう一人隠す</Sticker>
          <Sticker color="hide" tilt={-2}>ホームへ</Sticker>
        </div>
      </Board>
    </Bare>
  )
}
