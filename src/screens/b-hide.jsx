import {
  Bare, BodyPreview, Board, FigureIcon, Icon, Silhouette, Slider, Slot, Stage, Sticker, Tab, asset, rotate, FIG_W, FIG_H,
} from "./b-common.jsx"

/*
 * B案の「隠す」の画面。ページ選択は b-find.jsx の SiteSelectB を mode="hide" で使い、選ぶとそのまま隠れる画面へ進む
 * 流れ：ページ選択 → 編集（移動）→「塗る」などで色塗り・ポーズのダイアログ →「ここに隠れる！」→ 隠れた（ダイアログ）
 * 5分たつと編集が終わり、タイムアップのダイアログからその状態で隠せる。編集の「？」で遊び方のダイアログ
 * 中身は本体の Hide.jsx と同じ（道具、体型、デコイ、制限時間、ダイアログの文言）
 */

// 本体の hideJoints.js の BODY_TYPES と同じ（width は胴の幅、limb は手足の太さ）。隠れる画面の帯でいつでも切り替えられる
export const bodies = [
  { id: "slim", label: "細め", width: 18, limb: 8 },
  { id: "standard", label: "標準", width: 28, limb: 10 },
  { id: "round", label: "太め", width: 48, limb: 14 },
]

// 本体の Hide.jsx の TOOLS と同じ。移動のほかは押すと色塗り・ポーズのダイアログが開く
export const tools = [
  ["move", "移動", "ドラッグで移動（矢印キーで1pxずつ）"],
  ["pen", "塗る", "クリックやドラッグでパシャッと塗れます。矢印キーで位置も調整できます"],
  ["eraser", "消しゴム", "白に戻します"],
  ["joints", "ポーズ・角度", "関節をドラッグで調整し、全体の角度も変更"],
]

/** 隠す制限時間（5分）の残り。見つけるのタイマーと同じ形で、色は隠すの桃色 */
function HideTimer({ time = "3:42", ratio = 0.74 }) {
  return (
    <div className="b-timer b-timer--hide" style={rotate(-2)} role="timer" aria-label={`隠す残り時間 ${time}`}>
      <div className="b-timer__row"><span>残り</span><strong>{time}</strong></div>
      <div className="b-timer__bar"><span style={{ width: `${ratio * 100}%` }} /></div>
    </div>
  )
}

/**
 * 隠す画面の上の帯。本体と同じく、上の段はホーム・モード名・遊び方・残り時間と、元に戻す・名前・保存
 * 下の段は道具、体型、枠の表示とデコイ。色と太さは道具を押して開くダイアログの中にある
 */
function HideToolbar({ tool, name }) {
  return (
    <header className="b-tools">
      <div className="b-tools__row">
        <div className="b-hud__group">
          <Tab tilt={-2}>← ホーム</Tab>
          <span className="b-hud__mode">隠す</span>
          <button type="button" className="b-help" style={rotate(4)} aria-label="隠れるモードの説明">?</button>
          <HideTimer />
        </div>
        <div className="b-hud__group">
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
          <span className="b-tools__sep" />
          <div className="b-bodypick" role="group" aria-label="体型">
            <span>体型</span>
            {bodies.map((body) => (
              <button key={body.id} type="button" className="b-bodypick__choice" aria-pressed={body.id === "standard"}>
                <BodyPreview body={body} size={0.24} />
                {body.label}
              </button>
            ))}
          </div>
        </div>
        <div className="b-hud__group">
          <span className="b-check"><span className="b-check__box"><Icon name="check" size={16} /></span>枠を表示</span>
          <span className="b-tools__sep" />
          <Tab><Icon name="decoy" />デコイを追加 (1/3)</Tab>
        </div>
      </div>
    </header>
  )
}

/** 帯の下の1行。編集中の人型と位置。デコイを置いたら注意を添える */
function HideHint({ label = "本体" }) {
  return (
    <div className="b-hint">
      <strong>{label}を編集中</strong>
      位置: ({main.x}, {main.y})
      <span>／　デコイをクリックした人は残り時間が減ります</span>
    </div>
  )
}

export const main = { x: 760, y: 470 }
export const decoy = { x: 1010, y: 352 }

// 塗りかけの本体。背景の色を拾い、上から塗っている途中（色は public/sites/utcode.jpg のこの場所から測った）
export const paint = (
  <>
    <rect width="72" height="40" fill="#B4D8DE" />
    <rect y="40" width="72" height="40" fill="#7E9190" />
    <path d="M0 80H72V92C60 98 52 88 40 96S18 100 0 94Z" fill="#76757C" />
  </>
)

/** 編集（移動）。置いた直後の白い人型とデコイ */
export function HideEditB() {
  return (
    <div className="b-game">
      <HideToolbar tool="move" />
      <HideHint />
      <Stage>
        <Slot {...main} state="editing" label="本体" />
        <Slot {...decoy} state="editing-decoy" label="デコイ1" />
        <span className="b-cursor b-cursor--move" style={{ left: main.x + 18, top: main.y + 46 }}><Icon name="move" size={26} /></span>
      </Stage>
    </div>
  )
}

// 本体の Hide.jsx の COLOR_SWATCHES と同じ
const swatches = [
  ["白", "#ffffff"], ["黒", "#20252b"], ["赤", "#df6270"], ["黄", "#e8c45a"],
  ["緑", "#57a76c"], ["水色", "#76b8ab"], ["青", "#5a8ed8"], ["紫", "#a085c9"],
]

// ダイアログの中の拡大表示。本体と同じく人型の周り 160px 四方を見せる（JOINT_VIEW_SIZE）
const VIEW = 160
const VIEW_SCALE = 2.25
const view = { x: main.x + FIG_W / 2 - VIEW / 2, y: main.y + FIG_H / 2 - VIEW / 2 }

/**
 * 「塗る」を押して開く色塗り・ポーズのダイアログ。本体の hide-paint-modal と同じ中身
 * 上：道具の切り替え・元に戻す・閉じる、太さ／左：配置場所の背景ごと拡大した人型／右：色を選ぶ（自由に・パレット）、スポイト・全体塗り・色をリセット／下：完了
 */
function PaintDialog() {
  return (
    <Board as="div" role="dialog" aria-label="本体の色塗り・ポーズ調整" className="b-paint" tilt={0} tapes={["hide", "accent"]}>
      <span className="b-paint__grip" aria-hidden="true" />
      <div className="b-paint__row">
        <div className="b-hud__group">
          {tools.filter(([key]) => key !== "move").map(([key, label]) => (
            <Tab key={key} pressed={key === "pen"} color="hide"><Icon name={key} />{label}</Tab>
          ))}
        </div>
        <div className="b-hud__group">
          <Tab className="b-tab--icon" aria-label="元に戻す"><Icon name="undo" /></Tab>
          <Tab className="b-tab--icon" aria-label="やり直す"><Icon name="redo" /></Tab>
          <Tab className="b-tab--icon" tilt={3} aria-label="編集を閉じる">×</Tab>
        </div>
      </div>
      <span className="b-size">太さ<Slider value={0.48} color="hide" width={180} />6</span>
      <div className="b-paint__body">
        <div className="b-paint__surface" style={{ width: VIEW * VIEW_SCALE, height: VIEW * VIEW_SCALE }}>
          <div style={{ width: VIEW, height: VIEW, transform: `scale(${VIEW_SCALE})`, transformOrigin: "0 0", position: "relative", overflow: "hidden" }}>
            <img src={asset("sites/utcode.jpg")} alt="" width="1280" height="1000" style={{ position: "absolute", left: -view.x, top: -view.y, maxWidth: "none" }} />
            <Silhouette paint={paint} style={{ position: "absolute", left: main.x - view.x, top: main.y - view.y }} />
          </div>
        </div>
        <section className="b-picker" aria-label="色を選ぶ">
          <h3>色を選ぶ</h3>
          <div className="b-hud__group" role="group" aria-label="色の選び方">
            <Tab pressed color="accent">自由に選ぶ</Tab>
            <Tab pressed={false}>パレットから選ぶ</Tab>
          </div>
          <div className="b-picker__sv">
            <span className="b-picker__knob" style={{ left: "6%", top: "51%", background: "#76757C" }} />
          </div>
          <div className="b-picker__fields">
            <label className="b-picker__field"><span>色コード</span><span className="b-input b-input--s">#76757c</span></label>
            <label className="b-picker__field"><span>色相</span><span className="b-picker__hue"><span style={{ left: "69%" }} /></span></label>
          </div>
          <div className="b-picker__swatches" role="group" aria-label="基本の色">
            {swatches.map(([name, value]) => <span key={value} title={`${name} ${value}`} style={{ background: value }} />)}
          </div>
          <div className="b-hud__group b-picker__actions">
            <Tab><Icon name="eyedropper" />スポイト</Tab>
            <Tab><Icon name="fill" />全体塗り</Tab>
            <Tab>色をリセット</Tab>
          </div>
        </section>
      </div>
      <div className="b-modal__actions">
        <Sticker color="hide" tilt={-2}>完了</Sticker>
      </div>
    </Board>
  )
}

/** 編集（塗る）。帯の「塗る」で色塗り・ポーズのダイアログが開いたところ。ページの上の人型にも塗った色が出る */
export function HidePaintB() {
  return (
    <div className="b-game">
      <HideToolbar tool="pen" name="かべの人" />
      <HideHint />
      <Stage>
        <Slot {...main} state="editing" label="本体" paint={paint} />
        <Slot {...decoy} state="editing-decoy" label="デコイ1" />
      </Stage>
      <div className="b-paint__backdrop" aria-hidden="true" />
      <PaintDialog />
    </div>
  )
}

/** 編集の「？」で開く遊び方。本体の「隠れるモードの遊び方」と同じ中身 */
export function HideHelpB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-help-title" className="b-modal" tapes={["hide", "accent"]}>
        <div className="b-modal__head">
          <h2 id="b-help-title" className="b-modal__title">隠れるモードの遊び方</h2>
          <Tab tilt={3} aria-label="閉じる">×</Tab>
        </div>
        <p>人型のカメレオンをページのどこかに置き、背景になじむように色を塗って隠しましょう。「ここに隠れる！」を押すと保存され、見つけるモードで他の人に探してもらえます。</p>
        <p>隠す制限時間は5分です。時間が来ると編集が終了し、その時点の状態で保存できます。</p>
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
          <li>「体型」で細め・標準・太めを切り替えられます。塗りと関節のポーズは引き継がれます</li>
          <li>「ポーズ・角度」の画面で、左右の回転ボタンを押すと全体の角度を15度ずつ調整できます。角度の数字を押すとまっすぐに戻ります</li>
          <li>デコイ（ニセモノ）を最大3体まで置けます。デコイをクリックした人は残り時間が減ります</li>
          <li>Ctrl+Z で元に戻す、Ctrl+Shift+Z でやり直し。矢印キーは Shift を押しながらだと10pxずつ移動します</li>
        </ul>
        <div className="b-modal__actions">
          <Sticker color="hide" tilt={-2}>閉じる</Sticker>
        </div>
      </Board>
    </Bare>
  )
}

/** 5分たって編集が終わったとき。名前を入れて、その状態で隠せる */
export function HideTimeUpB() {
  return (
    <Bare>
      <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-timeup-title" className="b-modal" tapes={["hide", null]}>
        <h2 id="b-timeup-title" className="b-modal__title">タイムアップ！</h2>
        <p>5分が経過したので、編集を終了しました。<br />今の色・ポーズ・場所で隠せます。</p>
        <span className="b-input b-input--wide">かべの人</span>
        <div className="b-modal__actions">
          <Sticker tilt={2}>ホームへ</Sticker>
          <Sticker tilt={-1.5}>もう一度</Sticker>
          <Sticker color="hide" tilt={-2}>この状態で隠す</Sticker>
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
        <p>「かべの人」がページに潜みました。<br />デコイ 1 体も配置しました。<br />何人に探され、何人に見つかったかはホームで確認できます。</p>
        <div className="b-modal__actions">
          <Sticker tilt={2}>もう1体隠す</Sticker>
          <Sticker color="hide" tilt={-2}>ホームへ</Sticker>
        </div>
      </Board>
    </Bare>
  )
}
