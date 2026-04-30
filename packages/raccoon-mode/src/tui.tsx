/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const C_START = "\x01"
const C_END = "\x02"
type Palette = Record<string, string>
const tag = (n: string) => (s: string) => C_START + n + s + C_END
const e = tag("e")
const m = tag("m")
const n = tag("n")
const t = tag("t")

type Seg = { text: string; fg: string }

function parseSegments(line: string, palette: Palette, defaultFg: string): Seg[] {
  const out: Seg[] = []
  let buf = ""
  let fg = defaultFg
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === C_START) {
      if (buf) out.push({ text: buf, fg })
      buf = ""
      const tagName = line[i + 1]!
      fg = palette[tagName] ?? defaultFg
      i++
    } else if (c === C_END) {
      if (buf) out.push({ text: buf, fg })
      buf = ""
      fg = defaultFg
    } else {
      buf += c
    }
  }
  if (buf) out.push({ text: buf, fg })
  return out
}

const DEFAULT_FG = "#c4a484"
const PALETTE: Palette = { e: "#fbbf24", m: "#1f2937", n: "#ef4444", t: "#78716c" }

const FRAMES = [
  `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("^")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
  `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("_")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
  `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("o")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(o)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
  `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("*")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
]

const STATUSES = [
  "raccoons raiding the cache",
  "rummaging through node_modules",
  "found a shiny commit",
  "washing the diff",
  "scouting the dumpster fire",
]

const TIPS = [
  "always wash your data before consuming it",
  "the best bugs are found at 3am behind the dumpster",
  "if it shines, take it. if it tests, ship it",
  "trash today, treasure in next week's PR",
  "five small commits beat one big rummage",
  "logs are just shiny trash with timestamps",
  "every refactor is a new den",
]

const FRAME_MS = 350
const STATUS_MS = 3500
const TIP_MS = 12000

function rand<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length)
}

const tui: TuiPlugin = async (api) => {
  if (process.env.OPENCREATURE_OFF) return

  const render = (paddingX: number) => () => {
    const [frame, setFrame] = createSignal(0)
    const [status, setStatus] = createSignal(0)
    const [tip, setTip] = createSignal(0)
    const theme = () => api.theme.current

    createEffect(() => {
      const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS)
      onCleanup(() => clearInterval(id))
    })
    createEffect(() => {
      const id = setInterval(() => setStatus((s) => (s + 1) % STATUSES.length), STATUS_MS)
      onCleanup(() => clearInterval(id))
    })
    createEffect(() => {
      setTip(rand(TIPS))
      const id = setInterval(() => setTip((tt) => (tt + 1) % TIPS.length), TIP_MS)
      onCleanup(() => clearInterval(id))
    })

    const lines = createMemo(() => FRAMES[frame()]!.split("\n"))

    return (
      <box flexDirection="column" marginTop={1} paddingX={paddingX}>
        <text fg={DEFAULT_FG}><b>raccoon mode</b></text>
        <text fg={theme().textMuted}>· {STATUSES[status()]}</text>
        <For each={lines()}>
          {(line) => (
            <text>
              <For each={parseSegments(line, PALETTE, DEFAULT_FG)}>
                {(s) => <span {...({ fg: s.fg } as any)}>{s.text}</span>}
              </For>
            </text>
          )}
        </For>
        <text fg={theme().textMuted}>art: jgs (Joan Stark, 1997)</text>
        <text fg={theme().textMuted}>tip: {TIPS[tip()]}</text>
      </box>
    )
  }

  api.slots.register({
    order: 100,
    slots: {
      home_bottom: render(1),
      sidebar_content: render(0),
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "opencode-creature-raccoon",
  tui,
}

export default plugin
