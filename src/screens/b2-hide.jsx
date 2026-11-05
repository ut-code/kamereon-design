import { Button, Checkbox, Chip, ColorInput, Dialog, Divider, Heading, IconButton, ModeLabel, Range, Select, TextInput, Tile } from "../ui/ui.jsx"
import { Icon } from "../ui/icon.jsx"
import { bodies, decoy, main, paint, tools } from "./b-hide.jsx"
import { BodyPreview } from "./b-common.jsx"
import { Mark, PageHeader, PageTitle, Stage } from "./b2-common.jsx"
import { sites } from "./data.js"

/*
 * B案・実装版の「隠す」の画面。ページ選択は b2-find.jsx の SiteSelectB2 を mode="hide" で使う
 * 流れは元の案と同じ：ページ選択 → 体型選択 → 編集（移動・ペン）→ 隠れた（ダイアログ）。編集の「？」で遊び方
 * ツールバーの入力欄はブラウザの部品（select・range・color・checkbox）に枠と色を付けただけ
 */

/** 体型を選ぶ（2ステップ目）。体型の絵は本体の BodyPreview（SVG）をそのまま使い、色だけ CSS で変える */
export function HideBodyB2() {
  const site = sites[0]
  return (
    <div className="b2-screen">
      <main className="b2-flow">
        <PageHeader mode="hide" step={2} back="site" />
        <PageTitle>体型を選ぶ</PageTitle>
        <p className="b2-selected">選んだページ：<strong>{site.title}</strong></p>
        <fieldset className="b2-bodies">
          <legend className="b2-sr-only">カメレオンの体型</legend>
          {bodies.map((body) => {
            const selected = body.id === "standard"
            return (
              <label key={body.id} className={`b2-body${selected ? " is-selected" : ""}${body.ready ? "" : " is-soon"}`}>
                <input className="b2-sr-only" type="radio" name="b2-body" defaultChecked={selected} disabled={!body.ready} />
                <span className="b2-body__art"><BodyPreview body={body} /></span>
                <strong>{body.label}</strong>
                <span className="b2-body__state">{selected ? "● 選択中" : body.ready ? "○" : <Chip>準備中</Chip>}</span>
              </label>
            )
          })}
        </fieldset>
        <div className="b2-flowfoot">
          <p>今は標準の体型だけ遊べます</p>
          <Button color="hide" className="b2-body__go">編集へ →</Button>
        </div>
      </main>
    </div>
  )
}

/** 隠す画面の上の帯。上の段は移動と保存、下の段は塗る道具と人型。ペンと消しゴムの間だけ色と太さを出す */
function HideToolbar({ tool, name }) {
  return (
    <header className="b2-bar">
      <div className="b2-bar__row">
        <div className="b2-bar__group">
          <Button size="s" color="sub">← ホーム</Button>
          <ModeLabel mode="hide" />
          <IconButton label="隠すモードの遊び方" color="accent" className="b2-help">?</IconButton>
        </div>
        <div className="b2-bar__group">
          <Select aria-label="倍率" defaultValue="1"><option value="1">100%</option><option value="1.5">150%</option><option value="2">200%</option></Select>
          <Checkbox defaultChecked>枠を表示</Checkbox>
          <Divider />
          <IconButton label="元に戻す" color="sub"><Icon name="undo" /></IconButton>
          <IconButton label="やり直す" color="sub"><Icon name="redo" /></IconButton>
          <Divider />
          <TextInput placeholder="カメレオンの名前" defaultValue={name} maxLength={20} aria-label="カメレオンの名前" />
          <Button size="s" color="hide" className="b2-save">ここに隠れる！</Button>
        </div>
      </div>
      <div className="b2-bar__row">
        <div className="b2-bar__group">
          {tools.map(([key, label]) => (
            <Button key={key} size="s" color={tool === key ? "hide" : "sub"} aria-pressed={tool === key}><Icon name={key} />{label}</Button>
          ))}
          {tool !== "move" && (
            <>
              <Divider />
              {tool === "pen" && (
                <>
                  <ColorInput defaultValue="#76757c" aria-label="ペンの色" />
                  <Button size="s" color="sub"><Icon name="eyedropper" />スポイト</Button>
                  <Button size="s" color="sub"><Icon name="fill" />全体塗り</Button>
                </>
              )}
              <label className="b2-bar__field">太さ<Range color="hide" min="1" max="24" defaultValue="6" />6</label>
            </>
          )}
        </div>
        <div className="b2-bar__group">
          <Select aria-label="ポーズ" defaultValue="stand"><option value="stand">ポーズ: 直立</option><option value="banzai">ポーズ: ばんざい</option><option value="crouch">ポーズ: しゃがむ</option></Select>
          <IconButton label="左に回す" color="sub"><Icon name="rotateLeft" /></IconButton>
          <Button size="s" color="sub" title="クリックでまっすぐに戻す">0°</Button>
          <IconButton label="右に回す" color="sub"><Icon name="rotateRight" /></IconButton>
          <Divider />
          <Button size="s" color="sub"><Icon name="decoy" />デコイを追加 1/3</Button>
        </div>
      </div>
    </header>
  )
}

/** 編集。tool が move なら置いた直後の白い人型、pen なら塗りかけの人型と色・太さの設定 */
export function HideEditB2({ tool = "move" }) {
  const pen = tool === "pen"
  return (
    <div className="b2-game">
      <HideToolbar tool={tool} name={pen ? "かべの人" : ""} />
      <p className="b2-hint">
        <strong>本体を編集中</strong>
        位置: ({main.x}, {main.y})
        <span>／　デコイをクリックした人は残り時間が減ります</span>
      </p>
      <Stage>
        <Mark {...main} state="editing" label="本体" paint={pen ? paint : undefined} />
        <Mark {...decoy} state="editing-decoy" label="デコイ1" />
      </Stage>
    </div>
  )
}

/** 編集の「？」で開く遊び方 */
export function HideHelpB2() {
  return (
    <div className="b2-screen b2-screen--bare">
      <Dialog id="b2-help-title" title="隠すモードの遊び方" onClose={() => {}} className="b2-help-dialog" actions={<Button color="hide">閉じる</Button>}>
        <p>人型のカメレオンをページのどこかに置き、背景になじむように色を塗って隠しましょう。「ここに隠れる！」を押すと保存され、見つけるモードで他の人に探してもらえます。</p>
        <section className="b2-help-section">
          <Heading color="hide">ツール</Heading>
          <dl className="b2-help-tools">
            {tools.map(([key, label, hint]) => (
              <div key={key}>
                <dt><Icon name={key} />{label}</dt>
                <dd>{hint}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="b2-help-section">
          <Heading color="accent">その他</Heading>
          <ul className="b2-help-list">
            <li>ポーズを選んだり、左右の回転ボタンで回したりできます</li>
            <li>デコイ（ニセモノ）を3体まで置けます。デコイをクリックした人は残り時間が減ります</li>
            <li>Ctrl+Z で元に戻す、Ctrl+Shift+Z でやり直す。矢印キーは Shift を押しながらだと10pxずつ動きます</li>
          </ul>
        </section>
      </Dialog>
    </div>
  )
}

/** 「ここに隠れる！」で保存したあと。絵の代わりに、ロゴと同じ文字タイルに絵文字を1つ入れる */
export function HideSavedB2() {
  return (
    <div className="b2-screen b2-screen--bare">
      <Dialog
        id="b2-saved-title"
        title={<><Tile size="s" color="hide">🦎</Tile>隠れました！</>}
        actions={<><Button color="sub">もう一人隠す</Button><Button color="hide">ホームへ</Button></>}
      >
        <p>「かべの人」がページに潜みました。デコイ 1 体も置きました。<br />何人に探され、何人に見つかったかはホームで確かめられます。</p>
      </Dialog>
    </div>
  )
}
