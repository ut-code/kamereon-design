import { useState } from "react"
import { Button, Checkbox, Chip, ColorInput, Dialog, Heading, IconButton, ModeLabel, Panel, RankBadge, RankingList, Range, Select, Stat, Steps, TextInput, Tile } from "../ui/ui.jsx"
import { Icon } from "../ui/icon.jsx"
import { Reticle } from "./b-common.jsx"
import { Mark, Pop } from "./b2-common.jsx"
import { findRanking, hideRanking } from "./data.js"
import "./b2.css"

/*
 * B案・実装版。傾き・重ね置き・SVG の装飾を使わず、共通部品と grid / flex だけで組む
 * このファイルはタイトル・ルール・パーツ表。見つける・隠すの画面は b2-find.jsx・b2-hide.jsx
 * kamereon 本体の Home.jsx は、この TitleB2 の見た目に合わせて className を差し替える想定
 */

const logoSmall = ["め", "っ", "ち", "ゃ"]
const logoLarge = [["カ", "hide"], ["メ", "find"], ["レ", "accent"], ["オ", "camo"], ["ン", "white"]]

/** タイトルロゴ。文字タイルを並べるだけ。「オ」は背景に溶け込ませた1枚 */
function Logo() {
  return (
    <h1 className="b2-logo" aria-label="めっちゃカメレオン Web">
      <span className="b2-logo__row b2-logo__row--s" aria-hidden="true">
        {logoSmall.map((char) => <Tile key={char} size="s">{char}</Tile>)}
        <span className="b2-logo__web ui-bg-accent">Web</span>
      </span>
      <span className="b2-logo__row" aria-hidden="true">
        {logoLarge.map(([char, color]) => <Tile key={char} color={color}>{char}</Tile>)}
      </span>
    </h1>
  )
}

const rules = {
  find: ["Webページを選ぶ", "3分以内に5体を見つけてクリック", "早く見つけるほど高得点"],
  hide: ["Webページを選ぶ", "体型を選ぶ", "色を塗って背景に溶け込む", "「ここに隠れる！」で公開"],
}

/** 遊び方。手順だけを短く出し、点数の細かい計算は載せない。本体では今の <dialog> をそのまま使う */
function RulesDialog({ onClose }) {
  return (
    <div className="ui-backdrop">
      <RulesPanel onClose={onClose} />
    </div>
  )
}

/** 遊び方のダイアログの中身だけ。キャンバスでは背景の画面を付けずにこれだけを置く */
export function RulesPanel({ onClose = () => {} }) {
  return (
    <Dialog id="b2-rules-title" title="遊び方" onClose={onClose} className="b2-rules" actions={<Button color="find" onClick={onClose}>わかった</Button>}>
      <div className="b2-rules__body">
        {[["find", "見つける"], ["hide", "隠す"]].map(([mode, label]) => (
          <section key={mode}>
            <Heading color={mode}>{label}</Heading>
            <ol className="b2-rules__steps">
              {rules[mode].map((step, index) => (
                <li key={step}>
                  <RankBadge rank={index + 1} />
                  {step}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Dialog>
  )
}

/**
 * タイトル画面。period・expanded・rules は開いた状態で表示するための初期値
 * キャンバス上でもボタンを押すと切り替わる
 */
export function TitleB2({ period: initialPeriod = "all", expanded = false, rules: initialRules = false }) {
  const [period, setPeriod] = useState(initialPeriod)
  const [rulesOpen, setRulesOpen] = useState(initialRules)
  const daily = period === "daily"
  return (
    <div className="b2-screen">
      <main className="b2-home">
        <header className="b2-home__header">
          <Button size="s" aria-haspopup="dialog" onClick={() => setRulesOpen(true)}>? ルール</Button>
        </header>
        <Logo />
        <nav className="b2-home__modes" aria-label="モードを選ぶ">
          <Button size="l" color="find">見つける</Button>
          <Button size="l" color="hide">隠す</Button>
        </nav>
        <Panel className="b2-home__ranking" aria-labelledby="b2-ranking-title">
          <div className="b2-home__ranking-head">
            <h2 id="b2-ranking-title">ランキング</h2>
            <div className="b2-home__periods" role="group" aria-label="ランキングの期間">
              <Button size="s" color={daily ? "sub" : "accent"} aria-pressed={!daily} onClick={() => setPeriod("all")}>総合</Button>
              <Button size="s" color={daily ? "accent" : "sub"} aria-pressed={daily} onClick={() => setPeriod("daily")}>
                デイリー<Chip>準備中</Chip>
              </Button>
            </div>
          </div>
          <div className="b2-home__lists" key={period}>
            <RankingList title="見つけ上手" color="find" unit="点" entries={findRanking} state={daily ? "soon" : "ready"} expanded={expanded} />
            <RankingList title="隠れ上手" color="hide" unit="%" entries={hideRanking} state={daily ? "soon" : "ready"} />
          </div>
        </Panel>
      </main>
      {rulesOpen && <RulesDialog onClose={() => setRulesOpen(false)} />}
    </div>
  )
}

const colors = [
  ["地", "--bg", "#6C3FD1"],
  ["文字", "--ink", "#2A1650"],
  ["紙・白フチ", "--paper", "#FFFFFF"],
  ["見つける", "--find", "#C5F04A"],
  ["隠す", "--hide", "#FF7EB6"],
  ["差し色・選択中", "--accent", "#2EC4B6"],
  ["未選択・2位以下", "--sub", "#EEE6FB"],
  ["区切り線", "--line", "#D8CCF0"],
  ["補助文字", "--muted", "#5B4A7A"],
  ["擬態（オ）", "--camo", "#8D68EA"],
]

const values = [
  ["角丸", "0（すべて直角）"],
  ["白フチ", "--edge: 4px solid #FFFFFF"],
  ["影", "--shadow: 0 5px 0 rgba(42, 22, 80, .45)　※この1種類だけ"],
  ["ボタンの色", "主な操作は find / hide。ほかは紫の地の上では白、白い紙の上では sub（白い紙に白いボタンは置かない）"],
  ["余白", "--space-1〜5: 8 / 16 / 24 / 32 / 48 px"],
  ["ボタンの高さ", "L 112 / M 56 / S 40 px（文字 48 / 22 / 16）"],
  ["文字サイズ", "タイル 88・36 / 見出し 28・20 / 名前 18 / 数字 22 / ラベル 11–13"],
  ["動き", "transition: transform .15s, box-shadow .15s\nホバー：translateY(-2px)・影 7px ／ 押した時：translateY(3px)・影 2px\n「デコイ！」などの札は出して消すだけ（点滅・飛び出しはしない）"],
  ["絵", "新しい画像は作らない。人型は本体の figure.js、ページは iframe、アイコンは本体の Icon.jsx\n体型の見本は本体の BodyPreview、人数は四角の箱、保存の印は絵文字 🦎"],
  ["レイアウト", "中身は max-width 1040px で中央寄せ。並びは grid と flex だけ"],
]

function Item({ caption, children }) {
  return (
    <div className="b2-parts__item">
      {children}
      <span>{caption}</span>
    </div>
  )
}

/** パーツ表。本物の共通部品を並べているので、ここで見た目を直せば全画面に効く */
export function PartsB2() {
  return (
    <div className="b2-parts">
      <section>
        <h2 className="b2-parts__label">カラー</h2>
        <div className="b2-parts__swatches">
          {colors.map(([name, token, hex]) => (
            <div key={token} className="b2-parts__swatch">
              {token === "--camo" ? <div className="is-camo" /> : <div style={{ background: `var(${token})` }} />}
              <strong>{name}</strong>
              <span>{token}　{hex}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="b2-parts__label">フォント（Google Fonts 1行で読み込み）</h2>
        <div className="b2-parts__fonts">
          <Panel as="div">
            <span>Yusei Magic（400のみ）</span>
            <strong className="b2-parts__sample-display">見つける</strong>
            <span>タイトル・ボタン・見出し・タブ</span>
          </Panel>
          <Panel as="div">
            <span>M PLUS 1（500 / 700 / 800）</span>
            <strong className="b2-parts__sample-body">ワシの目　583点</strong>
            <span>名前・数字・本文・ラベル</span>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="b2-parts__label">基本の値（tokens.css）</h2>
        <Panel as="dl" className="b2-parts__values">
          {values.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </Panel>
      </section>

      <section>
        <h2 className="b2-parts__label">共通部品（ui.jsx）</h2>
        <div className="b2-parts__row">
          <Item caption={'Button color="find"'}><Button color="find">探しに行く</Button></Item>
          <Item caption={'color="hide"'}><Button color="hide">ここに隠れる</Button></Item>
          <Item caption={'color="white"'}><Button>← 戻る</Button></Item>
          <Item caption={'color="sub"'}><Button color="sub">やめる</Button></Item>
        </div>
        <div className="b2-parts__row">
          <Item caption="通常"><Button color="find">探しに行く</Button></Item>
          <Item caption="ホバー"><Button color="find" className="is-hover">探しに行く</Button></Item>
          <Item caption="押した時"><Button color="find" className="is-active">探しに行く</Button></Item>
        </div>
        <div className="b2-parts__row">
          <Item caption={'タブ = Button size="s"'}>
            <div className="b2-parts__inline">
              <Button size="s" color="accent" aria-pressed="true">総合</Button>
              <Button size="s" color="sub" aria-pressed="false">デイリー</Button>
            </div>
          </Item>
          <Item caption="Chip"><div className="b2-parts__inline"><Chip>準備中</Chip></div></Item>
          <Item caption="RankBadge">
            <div className="b2-parts__inline"><RankBadge rank={1} color="find" /><RankBadge rank={2} /></div>
          </Item>
          <Item caption={'Tile / color="camo"'}>
            <div className="b2-parts__inline"><Tile size="s" color="hide">カ</Tile><Tile size="s" color="camo">オ</Tile></div>
          </Item>
        </div>
      </section>

      <section>
        <h2 className="b2-parts__label">画面の部品（ui.jsx）</h2>
        <div className="b2-parts__row">
          <Item caption="ModeLabel"><div className="b2-parts__inline"><ModeLabel mode="find" /><ModeLabel mode="hide" /></div></Item>
          <Item caption="Steps"><div className="b2-parts__inline"><Steps items={["ページ", "体型"]} current={2} /></div></Item>
          <Item caption="Stat"><Stat color="find" value="5人" label="潜んでいる" /></Item>
          <Item caption="IconButton"><div className="b2-parts__inline"><IconButton label="元に戻す" color="sub"><Icon name="undo" /></IconButton><IconButton label="遊び方" color="accent">?</IconButton></div></Item>
        </div>
        <Item caption="入力欄　Select / Checkbox / Range / TextInput / ColorInput（ブラウザの部品に枠と色を付けるだけ）">
          <Panel as="div" className="b2-parts__controls">
            <Select aria-label="倍率" defaultValue="1"><option value="1">100%</option></Select>
            <Checkbox defaultChecked>枠を表示</Checkbox>
            <Range color="hide" defaultValue="6" min="1" max="24" aria-label="太さ" />
            <TextInput placeholder="カメレオンの名前" aria-label="カメレオンの名前" />
            <ColorInput defaultValue="#76757c" aria-label="ペンの色" />
          </Panel>
        </Item>
      </section>

      <section>
        <h2 className="b2-parts__label">ゲーム中の目印（四角い枠の色と線だけで見分ける）</h2>
        <div className="b2-parts__marks">
          <div><span className="b2-parts__mark"><Reticle x={84} y={86} /></span>照準</div>
          <div><span className="b2-parts__mark"><Mark x={55} y={22} state="found" fill="#B9C3CF" /></span>見つけた</div>
          <div><span className="b2-parts__mark"><Mark x={55} y={22} state="missed" fill="#B9C3CF" /></span>見逃した</div>
          <div><span className="b2-parts__mark"><Mark x={55} y={22} state="tripped" fill="#B9C3CF" /></span>押したデコイ</div>
          <div><span className="b2-parts__mark"><Mark x={55} y={22} state="editing" /></span>編集中</div>
          <div><span className="b2-parts__mark"><Mark x={55} y={22} state="editing-decoy" /></span>編集中のデコイ</div>
          <div className="b2-parts__wide"><span className="b2-parts__mark"><Pop x={24} y={64}>デコイ！ −10秒</Pop></span>デコイを押した</div>
        </div>
      </section>
    </div>
  )
}
