/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const C_START = "\x01"
const C_END = "\x02"
type Palette = Record<string, string>
const tag = (n: string) => (s: string) => C_START + n + s + C_END
const e = tag("e")
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

const DEFAULT_FG = "#67e8f9"
const PALETTE: Palette = { e: "#fef08a", n: "#fb923c", t: "#475569" }

const FRAMES = [
  `                          .---.
                         /  ${e("(o")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
  `                          .---.
                         /  ${e("(-")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
  `                          .---.
                         /  ${e("(O")} \\_
                         | ${n("-o")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
  `                          .---.
                         /  ${e("(o")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
]

const STATUSES = [
  "scanning ledges for crumbs",
  "spotting bugs from above",
  "head-bobbing through the diff",
  "suspicious of the new framework",
  "remembered something tangential",
]

const TIPS = [
  "crumb on line 47 — wait what was the question",
  "every endpoint is a feeding station. some give bread. some give panic",
  "small commits are easier to peck through",
  "git blame is just bird-watching with extra steps",
  "shiny new framework? hmm. coo. suspicious",
  "logs are crumbs. follow them home",
  "deployment is taking flight. flight is mostly falling on purpose",
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
        <text fg={DEFAULT_FG}><b>pigeon mode</b></text>
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
  id: "opencode-creature-pigeon",
  tui,
}

export default plugin
