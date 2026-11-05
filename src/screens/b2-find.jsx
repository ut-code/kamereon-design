import { Button, Dialog, ModeLabel, Panel, Range, Stat } from "../ui/ui.jsx"
import { Icon } from "../ui/icon.jsx"
import { Reticle, asset } from "./b-common.jsx"
import { aim, chameleons, decoys } from "./b-find.jsx"
import { Mark, PageHeader, PageTitle, Pop, Stage } from "./b2-common.jsx"
import { sites } from "./data.js"

/*
 * B案・実装版の「見つける」の画面。ページ選択は「隠す」でも使う
 * 流れは元の案と同じ：ページ選択 → 選んだページ → スタート前（ダイアログ）→ プレイ中 → 終了
 * 元の案から、傾き・テープ・葉っぱの背景・人形のアイコンを外し、共通部品と grid / flex だけで組む
 */

/** Webページを選ぶ。カードは同じ形を並べるだけ。プレビューは本体と同じく iframe を縮小して見せる（画像は用意しない） */
export function SiteSelectB2({ mode }) {
  return (
    <div className="b2-screen">
      <main className="b2-flow">
        <PageHeader mode={mode} step={mode === "hide" ? 1 : undefined} />
        <PageTitle>Webページを選ぶ</PageTitle>
        <p className="b2-lead">{mode === "find" ? "カメレオンが潜んでいるページを選んでください" : "カメレオンを隠すページを選んでください"}</p>
        <div className="b2-sites">
          {sites.map((site) => (
            <Panel as="article" key={site.id} className="b2-site">
              <img className="b2-site__preview" src={asset(site.image)} alt="" />
              <h2>{site.title}</h2>
              <Button color={mode}>選択する →</Button>
            </Panel>
          ))}
          <div className="b2-site b2-site--soon">準備中</div>
        </div>
      </main>
    </div>
  )
}

/** ルールの要点。選んだページとスタート前のダイアログで同じものを出す */
function Facts() {
  return (
    <div className="b2-facts">
      <Stat color="find" value="5人" label="潜んでいる" />
      <Stat color="accent" value="3:00" label="制限時間" />
      <Stat color="hide" value="−10秒" label="デコイを押すと" />
    </div>
  )
}

/** 選んだページの確認。左にページ、右にルールの要点と「探しに行く」 */
export function FindReadyB2() {
  const site = sites[0]
  return (
    <div className="b2-screen">
      <main className="b2-flow">
        <PageHeader mode="find" back="site" />
        <PageTitle>選んだWebページ</PageTitle>
        <div className="b2-ready">
          <Panel as="figure" className="b2-ready__site">
            <img src={asset(site.image)} alt="" />
            <figcaption>{site.title}</figcaption>
          </Panel>
          <div className="b2-ready__side">
            <Panel className="b2-ready__rules">
              <h2>このページのルール</h2>
              <Facts />
            </Panel>
            <Button size="l" color="find" className="b2-ready__go">探しに行く →</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

/** ゲームのページを開いたときのダイアログ。ページの読み込みが終わると「スタート」を押せる */
export function FindIntroB2() {
  return (
    <div className="b2-screen b2-screen--bare">
      <Dialog id="b2-intro-title" title="カメレオンを探せ！" actions={<Button color="find">スタート</Button>}>
        <p>このページのどこかに、最大5人のカメレオンが潜んでいます。<br />見つけたらクリック！</p>
        <Facts />
        <p className="ui-dialog__note">クリックするたびに5秒間はクリックできません（当たり・外れ・デコイのどれでも）</p>
      </Dialog>
    </div>
  )
}

/** 出題できるカメレオンがいないとき（自分が隠したものは出題しない）。スタート前の代わりに出す */
export function FindEmptyB2() {
  return (
    <div className="b2-screen b2-screen--bare">
      <Dialog id="b2-empty-title" title="まだ誰も隠れていません" actions={<><Button color="sub">ホームへ</Button><Button color="hide">隠れる</Button></>}>
        <p>自分が隠したカメレオンは出題されません。<br />まずは隠すモードで隠れてみましょう。</p>
      </Dialog>
    </div>
  )
}

/**
 * 見つける画面の上の帯。左にホームと倍率、真ん中に残り時間、右に見つけた数と操作
 * 終わるとタイマーの代わりに結果、右にスコアと「もう一度」を出す。人数は四角の箱で出す
 */
export function PlayHeader({ over = false, found = 3, total = 5 }) {
  return (
    <header className="b2-play">
      <div className="b2-play__group">
        <Button size="s" color="sub">← ホーム</Button>
        <ModeLabel mode="find" />
        <label className="b2-play__zoom">
          <Icon name="search" />
          <Range min="1" max="3" step="0.1" defaultValue="1" aria-label="倍率" />
          100%
        </label>
      </div>
      {over ? (
        <span className="b2-play__box b2-play__result ui-bg-hide">タイムアップ！</span>
      ) : (
        <span className="b2-play__box b2-play__timer ui-bg-find" role="timer"><span>残り</span><strong>2:14</strong></span>
      )}
      <div className="b2-play__group b2-play__group--end">
        {!over && <span className="b2-play__cooldown" title="クールタイム中はクリックできません"><Icon name="hourglass" size={16} />4秒</span>}
        <span className="b2-play__people" role="img" aria-label={`${total}体中${found}体発見`}>
          {Array.from({ length: total }, (_, index) => <span key={index} className={index < found ? "is-found" : undefined} />)}
        </span>
        <span className="b2-play__count">{found}<small>/{total}</small></span>
        {over ? (
          <>
            <span className="b2-play__score"><small>スコア</small>327<small>点</small></span>
            <Button size="s" color="find">もう一度</Button>
          </>
        ) : (
          <>
            <Button size="s" color="accent" aria-pressed="true">発見済みを表示</Button>
            <Button size="s" color="sub" className="b2-play__end">終了</Button>
          </>
        )}
      </div>
    </header>
  )
}

/** プレイ中。見つけたカメレオン（発見済みを表示中）、照準に照らされた影、押してしまったデコイ */
export function FindPlayB2() {
  const { wall, ceiling } = chameleons
  return (
    <div className="b2-game">
      <PlayHeader />
      <Stage>
        <Mark {...wall} state="found" label={wall.name} />
        <Mark {...ceiling} shadow={aim} />
        <Mark {...decoys.bags} state="tripped" label={`デコイ（${decoys.bags.owner}）`} />
        <Pop x={268} y={716}>デコイ！ −10秒</Pop>
        <Reticle {...aim} />
      </Stage>
    </div>
  )
}

/** 終了（タイムアップ）。見つけたものは黄緑、見逃したものは桃色の枠で囲み、デコイも全部見せる */
export function FindOverB2() {
  const found = ["wall", "right", "desk"]
  return (
    <div className="b2-game">
      <PlayHeader over />
      <Stage>
        {Object.entries(chameleons).map(([key, c]) => (
          <Mark key={key} {...c} state={found.includes(key) ? "found" : "missed"} label={c.name} />
        ))}
        {Object.entries(decoys).map(([key, d]) => (
          <Mark key={key} {...d} state={key === "bags" ? "tripped" : "decoy"} label={`デコイ（${d.owner}）`} />
        ))}
      </Stage>
    </div>
  )
}
