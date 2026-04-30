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

const DEFAULT_FG = "#65a30d"
const PALETTE: Palette = { e: "#f97316", m: "#1c1917", n: "#dc2626" }

const FRAMES = [
  `      -. -. \`.  / .-' _.'  _
     .--\`. \`. \`| / __.-- _' \`
    '.-.  \\  \\ |  /   _.' \`_
    .-. \\  \`  || |  .' _.-' \`.
  .' _ \\ '  -    -'  - \` _.-.
   .' \`. ${m("%%%%%")}   | ${m("%%%%%")} _.-.\`-
 .' .-. ><${e("(@)")}> ) ( <${e("(@)")}>< .-.\`.
   (("\`(   ${n("-")}   | |   ${n("-")}   )'"))
  / \\\\#)\\    (.(_).)    /(#//\\
 ' / ) ((  /   | |   \\  )) (\`.\`.
 .'  (.) \\ .md88o88bm. / (.) \\)
   / /| / \\ \`Y88888Y' / \\ | \\ \\
 .' / O  / \`.   -   .' \\  O \\ \\\\
  / /(O)/ /| \`.___.' | \\\\(O) \\
   / / / / |  |   |  |\\  \\  \\ \\
   / / // /|  |   |  |  \\  \\ \\  VK
 _.--/--/'( ) ) ( ) ) )\`\\-\\-\\-._
( ( ( ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
  `      -. -. \`.  / .-' _.'  _
     .--\`. \`. \`| / __.-- _' \`
    '.-.  \\  \\ |  /   _.' \`_
    .-. \\  \`  || |  .' _.-' \`.
  .' _ \\ '  -    -'  - \` _.-.
   .' \`. ${m("%%%%%")}   | ${m("%%%%%")} _.-.\`-
 .' .-. ><${e("(-)")}> ) ( <${e("(-)")}>< .-.\`.
   (("\`(   ${n("-")}   | |   ${n("-")}   )'"))
  / \\\\#)\\    (.(_).)    /(#//\\
 ' / ) ((  /   | |   \\  )) (\`.\`.
 .'  (.) \\ .md88o88bm. / (.) \\)
   / /| / \\ \`Y88888Y' / \\ | \\ \\
 .' / O  / \`.   -   .' \\  O \\ \\\\
  / /(O)/ /| \`.___.' | \\\\(O) \\
   / / / / |  |   |  |\\  \\  \\ \\
   / / // /|  |   |  |  \\  \\ \\  VK
 _.--/--/'( ) ) ( ) ) )\`\\-\\-\\-._
( ( ( ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
  `      -. -. \`.  / .-' _.'  _
     .--\`. \`. \`| / __.-- _' \`
    '.-.  \\  \\ |  /   _.' \`_
    .-. \\  \`  || |  .' _.-' \`.
  .' _ \\ '  -    -'  - \` _.-.
   .' \`. ${m("VVVVV")}   | ${m("VVVVV")} _.-.\`-
 .' .-. ><${e("(O)")}> ) ( <${e("(O)")}>< .-.\`.
   (("\`(   ${n("o")}   | |   ${n("o")}   )'"))
  / \\\\#)\\    (.(_).)    /(#//\\
 ' / ) ((  /   | |   \\  )) (\`.\`.
 .'  (.) \\ .md88o88bm. / (.) \\)
   / /| / \\ \`Y88888Y' / \\ | \\ \\
 .' / O  / \`.   -   .' \\  O \\ \\\\
  / /(O)/ /| \`.___.' | \\\\(O) \\
   / / / / |  |   |  |\\  \\  \\ \\
   / / // /|  |   |  |  \\  \\ \\  VK
 _.--/--/'( ) ) ( ) ) )\`\\-\\-\\-._
( ( ( ) ( ) ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
  `      -. -. \`.  / .-' _.'  _
     .--\`. \`. \`| / __.-- _' \`
    '.-.  \\  \\ |  /   _.' \`_
    .-. \\  \`  || |  .' _.-' \`.
  .' _ \\ '  -    -'  - \` _.-.
   .' \`. ${m("%%%%%")}   | ${m("%%%%%")} _.-.\`-
 .' .-. ><${e("(o)")}> ) ( <${e("(o)")}>< .-.\`.
   (("\`(   ${n("v")}   | |   ${n("v")}   )'"))
  / \\\\#)\\    (.(_).)    /(#//\\
 ' / ) ((  /   | |   \\  )) (\`.\`.
 .'  (.) \\ .md88o88bm. / (.) \\)
   / /| / \\ \`Y88888Y' / \\ | \\ \\
 .' / O  / \`.   -   .' \\  O \\ \\\\
  / /(O)/ /| \`.___.' | \\\\(O) \\
   / / / / |  |   |  |\\  \\  \\ \\
   / / // /|  |   |  |  \\  \\ \\  VK
 _.--/--/'( ) ) ( ) ) )\`\\-\\-\\-._
( ( ( ) ( ) ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
]

const STATUSES = [
  "troll under the bridge watching",
  "smashing rocks in code",
  "eyeing your refactor",
  "guarding the main branch",
  "grumpy about the build time",
]

const TIPS = [
  "code work or code not work. no in between",
  "if test fail, smash test until pass. wait. that bad. fix code instead",
  "abstraction is rock with extra steps",
  "delete more code than you write today",
  "tabs vs spaces. troll use whatever editor pick",
  "premature optimization is rock you trip on",
  "READ error message. all of it. yes the long part too",
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
        <text fg={DEFAULT_FG}><b>troll mode</b></text>
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
        <text fg={theme().textMuted}>art: VK (Veronica Karlsson)</text>
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
  id: "opencode-creature-troll",
  tui,
}

export default plugin
