import { findRanking, hideRanking } from "./data.js"
import { Board, FigureIcon, Ground, Reticle, Slot, Sticker, Tab, figurePath, rotate } from "./b-common.jsx"

/*
 * B案（元の案）。傾き（rotate）、重ね置き、SVG の背景を使う
 * タイトルとルール、パーツ表がこのファイル。見つける・隠すの画面は b-find.jsx・b-hide.jsx、共通部品は b-common.jsx
 */

const logoSmall = [["め", -6], ["っ", 4], ["ち", -3], ["ゃ", 5]]
const logoLarge = [["カ", "var(--hide)", -4], ["メ", "var(--find)", 3], ["レ", "var(--accent)", -2], ["オ", "camo", 4], ["ン", "var(--paper)", -3]]
const badgeTilt = [[-6, 4, -3], [5, -4, 3]]

function Ranking({ title, color, label, unit, entries, tilt, markTilt }) {
  return (
    <div className="b-ranking">
      <div className="b-ranking__head">
        <h3><span className="b-ranking__mark" style={{ background: color, ...rotate(markTilt) }} aria-hidden="true" />{title}</h3>
        <span>{label}</span>
      </div>
      <ol>
        {entries.slice(0, 3).map((entry, index) => (
          <li key={entry.name}>
            <span className="b-ranking__badge" style={{ background: index === 0 ? color : "var(--sub)", ...rotate(tilt[index]) }}>{index + 1}</span>
            <span className="b-ranking__name">{entry.name}</span>
            <span className="b-ranking__score">{entry.score}<small>{unit}</small></span>
          </li>
        ))}
      </ol>
      <button type="button" className="b-ranking__more">4位以下</button>
    </div>
  )
}

export function TitleB() {
  return (
    <div className="b-screen">
      <Ground />

      <div className="b-home">
        <button type="button" className="b-sticker b-home__rules" style={rotate(3)}>？ ルール</button>

        <h1 className="b-logo" aria-label="めっちゃカメレオン Web">
          <span className="b-logo__row b-logo__row--s" aria-hidden="true">
            {logoSmall.map(([char, deg]) => <span key={char} className="b-logo__tile b-logo__tile--s" style={rotate(deg)}>{char}</span>)}
          </span>
          <span className="b-logo__row" aria-hidden="true">
            {logoLarge.map(([char, color, deg]) =>
              color === "camo" ? (
                <span key={char} className="b-logo__tile b-logo__tile--camo" style={rotate(deg)}>{char}</span>
              ) : (
                <span key={char} className="b-logo__tile" style={{ background: color, ...rotate(deg) }}>{char}</span>
              ),
            )}
            <span className="b-logo__web">Web</span>
          </span>
        </h1>

        <nav className="b-home__modes" aria-label="モードを選ぶ">
          <button type="button" className="b-sticker b-mode" style={{ background: "var(--find)", ...rotate(-2) }}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" aria-hidden="true">
              <path d="M13 4.5L21.5 8L23 14L19 21L11 22L5 16.5L6 9Z" />
              <path d="M19.5 20L27.5 28" />
            </svg>
            見つける
          </button>
          <button type="button" className="b-sticker b-mode" style={{ background: "var(--hide)", ...rotate(2) }}>
            <svg width="30" height="56" viewBox="0 0 88 168" fill="currentColor" aria-hidden="true"><path d={figurePath} /></svg>
            隠す
          </button>
        </nav>

        <section className="b-board" aria-labelledby="b-ranking-title">
          <span className="b-tape b-tape--left" aria-hidden="true" />
          <span className="b-tape b-tape--right" aria-hidden="true" />
          <div className="b-board__head">
            <h2 id="b-ranking-title">ランキング</h2>
            <div className="b-board__periods" role="group" aria-label="ランキングの期間">
              <button type="button" aria-pressed="true" className="b-tab" style={{ background: "var(--accent)", ...rotate(-2) }}>総合</button>
              <button type="button" aria-pressed="false" className="b-tab b-tab--off" style={rotate(1.5)}>
                デイリー<span className="b-chip">準備中</span>
              </button>
            </div>
          </div>
          <div className="b-board__lists">
            <Ranking title="見つけ上手" color="var(--find)" label="スコア" unit="点" entries={findRanking} tilt={badgeTilt[0]} markTilt={12} />
            <Ranking title="隠れ上手" color="var(--hide)" label="隠れ率" unit="%" entries={hideRanking} tilt={badgeTilt[1]} markTilt={-10} />
          </div>
        </section>
      </div>
    </div>
  )
}

const rulesSteps = {
  find: ["探すWebページを選んでスタート", "毎回選ばれる5体を、3分以内に見つけてクリック", "発見数と早さでスコアが決まる"],
  hide: ["隠すWebページを選ぶ", "細め・標準・太めから体型を選ぶ", "配置して色を塗り、背景に溶け込ませる", "「ここに隠れる！」で公開する"],
}
const rulesNote = {
  find: "1体100点＋早さのボーナス最大20点。デコイを押すと残り時間が10秒減る",
  hide: "画面に映って見つからない間だけ加点。見つかるとためた点が半分になる",
}

/** 遊び方。タイトルの「？ ルール」で開くモーダル。手順を短く出し、点数は1行だけ添える */
export function RulesB() {
  return (
    <Board as="div" role="dialog" aria-modal="true" aria-labelledby="b-rules-title" className="b-modal b-rules" tapes={["find", "hide"]}>
      <div className="b-modal__head">
        <h2 id="b-rules-title" className="b-modal__title">遊び方</h2>
        <Tab tilt={3} aria-label="閉じる">×</Tab>
      </div>
      <div className="b-rules__cols">
        {[["find", "見つける"], ["hide", "隠す"]].map(([mode, label], col) => (
          <section key={mode} className="b-rules__col">
            <h3 className="b-rules__mode" style={{ background: `var(--${mode})`, ...rotate(col ? 2 : -2) }}>{label}</h3>
            <ol>
              {rulesSteps[mode].map((step, index) => (
                <li key={step}>
                  <span className="b-ranking__badge" style={{ background: index === 0 ? `var(--${mode})` : "var(--sub)", ...rotate(badgeTilt[col][index % 3]) }}>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="b-modal__note">{rulesNote[mode]}</p>
          </section>
        ))}
      </div>
      <div className="b-modal__actions">
        <Sticker color="find" tilt={-2}>わかった</Sticker>
      </div>
    </Board>
  )
}

const colors = [
  ["地", "#6C3FD1"], ["文字", "#2A1650"], ["見つける", "#C5F04A"], ["隠す", "#FF7EB6"], ["差し色", "#2EC4B6"], ["紙", "#FFFFFF"],
]

export function PartsB() {
  return (
    <div className="b-parts">
      <section>
        <h2 className="b-parts__label" style={rotate(-2)}>カラー</h2>
        <div className="b-parts__swatches">
          {colors.map(([name, hex]) => (
            <div key={hex}>
              <div className={name === "地" ? "is-ground" : undefined} style={name === "地" ? undefined : { background: hex }} />
              <strong>{name}</strong>
              <span>{hex}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="b-parts__label" style={rotate(1.5)}>フォント</h2>
        <div className="b-parts__fonts">
          <div style={rotate(-0.8)}>
            <span>Yusei Magic — タイトル・ボタン・見出し</span>
            <strong className="b-parts__display">見つける！</strong>
            <span>タイトル 96 / ボタン 50 / 見出し 21–30</span>
          </div>
          <div style={rotate(0.8)}>
            <span>M PLUS 1 — 名前・数字・本文</span>
            <strong className="b-parts__body">ワシの目　583点</strong>
            <span>本文 15–18 / 800・700・500</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="b-parts__label" style={rotate(-1.5)}>ボタン</h2>
        <div className="b-parts__row">
          <div className="b-parts__item">
            <button type="button" className="b-sticker b-parts__btn" style={{ background: "var(--find)", ...rotate(-2) }}>探しに行く</button>
            <span>通常　−2°</span>
          </div>
          <div className="b-parts__item">
            <button type="button" className="b-sticker b-parts__btn" style={{ background: "var(--find)", transform: "translateY(-4px)", boxShadow: "0 9px 0 rgba(42, 22, 80, .45)" }}>探しに行く</button>
            <span>ホバー　まっすぐ＋浮く</span>
          </div>
          <div className="b-parts__item">
            <button type="button" className="b-sticker b-parts__btn" style={{ background: "var(--find)", transform: "translateY(4px) rotate(-2deg)", boxShadow: "0 1px 0 rgba(42, 22, 80, .45)" }}>探しに行く</button>
            <span>押した時　貼りつく</span>
          </div>
        </div>
        <div className="b-parts__row">
          <button type="button" className="b-sticker b-parts__btn b-parts__btn--hide" style={rotate(2)}>ここに隠れる！</button>
          <button type="button" className="b-sticker b-parts__btn b-parts__btn--s" style={rotate(-3)}>← 戻る</button>
          <div className="b-parts__tabs" style={rotate(-1)}>
            <button type="button" aria-pressed="true" className="b-tab" style={{ background: "var(--accent)", ...rotate(-2) }}>総合</button>
            <button type="button" aria-pressed="false" className="b-tab b-tab--off" style={rotate(1.5)}>デイリー</button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="b-parts__label" style={rotate(1)}>プレイ画面ヘッダー（見つける）</h2>
        <div className="b-parts__hud">
          <div className="b-parts__inline">
            <button type="button" className="b-tab b-tab--off" style={rotate(-2)}>← ホーム</button>
            <span className="b-parts__mode">見つける</span>
          </div>
          <div className="b-parts__timer" style={rotate(-2)}>
            <span>残り</span>
            <strong>2:14</strong>
          </div>
          <div className="b-parts__inline">
            <span className="b-parts__inline" role="img" aria-label="5体中3体発見" style={{ gap: 4 }}>
              {[0, 1, 2, 3, 4].map((index) => <FigureIcon key={index} fill={index < 3 ? "#FF7EB6" : "#E2D8F5"} />)}
            </span>
            <span className="b-parts__count">3<small>/5</small></span>
            <button type="button" className="b-tab" style={{ background: "var(--paper)", ...rotate(2) }}>終了</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="b-parts__label" style={rotate(-1)}>ゲーム中の目印</h2>
        <div className="b-parts__marks">
          <div><span className="b-parts__mark"><Reticle x={50} y={86} /></span>照準</div>
          <div><span className="b-parts__mark"><Slot x={21} y={22} state="found" fill="#B9C3CF" /></span>見つけた</div>
          <div><span className="b-parts__mark"><Slot x={21} y={22} state="missed" fill="#B9C3CF" /></span>見逃した</div>
          <div><span className="b-parts__mark"><Slot x={21} y={22} state="tripped" fill="#B9C3CF" /></span>押したデコイ</div>
          <div><span className="b-parts__mark"><Slot x={21} y={22} state="editing" /></span>編集中</div>
          <div><span className="b-parts__mark b-parts__mark--wide"><span className="b-pop" style={{ left: 8, top: 66, ...rotate(-4) }}>デコイ！ −10秒</span></span>デコイを押した</div>
        </div>
      </section>
    </div>
  )
}
