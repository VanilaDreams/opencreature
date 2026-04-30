/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const C_START = "\x01"
const C_END = "\x02"
type Palette = Record<string, string>
const tag = (n: string) => (s: string) => C_START + n + s + C_END
const e = tag("e")
const n = tag("n")

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

const DEFAULT_FG = "#84cc16"
const PALETTE: Palette = { e: "#fef3c7", n: "#a3e635" }

const FRAMES = [
  `          c,_.--.,y
            7 ${e("a.a")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  - (
     .'"""S,._'--'_2..,_
     |    ':::::=:::::  \\
     .     f== ;-,---.' T
      Y.   r,-,_/_      |
      |:\\___.---' '---./
      |'\`             )
       \\             ,
       ':;,.________.;L
       /  '---------' |
       |              \\
       L---'-,--.-'--,-'
        T    /   \\   Y
snd     |   Y    ,   |`,
  `          c,_.--.,y
            7 ${e("-.-")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  - (
     .'"""S,._'--'_2..,_
     |    ':::::=:::::  \\
     .     f== ;-,---.' T
      Y.   r,-,_/_      |
      |:\\___.---' '---./
      |'\`             )
       \\             ,
       ':;,.________.;L
       /  '---------' |
       |              \\
       L---'-,--.-'--,-'
        T    /   \\   Y
snd     |   Y    ,   |`,
  `          c,_.--.,y
            7 ${e("o.o")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  ${n("o")} (
     .'"""S,._'--'_2..,_
     |    ':::::=:::::  \\
     .     f== ;-,---.' T
      Y.   r,-,_/_      |
      |:\\___.---' '---./
      |'\`             )
       \\             ,
       ':;,.________.;L
       /  '---------' |
       |              \\
       L---'-,--.-'--,-'
        T    /   \\   Y
snd     |   Y    ,   |`,
  `          c,_.--.,y
            7 ${e("O.O")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  ${n("v")} (
     .'"""S,._'--'_2..,_
     |    ':::::=:::::  \\
     .     f== ;-,---.' T
      Y.   r,-,_/_      |
      |:\\___.---' '---./
      |'\`             )
       \\             ,
       ':;,.________.;L
       /  '---------' |
       |              \\
       L---'-,--.-'--,-'
        T    /   \\   Y
snd     |   Y    ,   |`,
]

const STATUSES = [
  "peeling onion abstractions",
  "swamp gas detected",
  "ogres do not premature-optimize",
  "layered like always",
  "fresh swamp water flowing",
]

const TIPS = [
  "code is like onions. layers. you peel and you cry",
  "fresh swamp water is better than stale swamp water",
  "ogres do not split twenty-line files into five files",
  "the old swamp had reasons. respect the old swamp",
  "if abstraction has only one user, it is not abstraction. it is detour",
  "comments explain why. names explain what. ogre tired",
  "deploy on friday. live with the consequences",
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
        <text fg={DEFAULT_FG}><b>ogre mode</b></text>
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
        <text fg={theme().textMuted}>art: snd (Shanaka Dias)</text>
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
  id: "opencode-creature-ogre",
  tui,
}

export default plugin
