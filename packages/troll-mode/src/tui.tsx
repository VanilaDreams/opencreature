/** @jsxImportSource @opentui/solid */
import { createEffect, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const FRAMES = [
`      /|  /|
     J(|_J(|
    /     _ \`_
   J     '_ ' \\
   F     (.) (.)--._
  /                 \`.
 J                   |
 F       ._         .'
J          \`-.____.'
F           \\`,
`      /|  /|
     J(|_J(|
    /     _ \`_
   J     '_ ' \\
   F     (-) (-)--._
  /                 \`.
 J                   |
 F       ._         .'
J          \`-.____.'
F           \\`,
`      /|  /|
     J(|_J(|
    /     _ \`_
   J     '_ ' \\
   F     (o) (o)--._
  /                 \`.
 J                   |
 F       o_         .'
J          \`-.____.'
F           \\`,
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

const FRAME_MS = 400
const STATUS_MS = 3500
const TIP_MS = 12000

function rand<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length)
}

const tui: TuiPlugin = async (api) => {
  if (process.env.OPENCREATURE_OFF) return

  const renderCreature = (paddingX: number) => () => {
    const [frame, setFrame] = createSignal(0)
    const [status, setStatus] = createSignal(0)
    const [tip, setTip] = createSignal(rand(TIPS))
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
      const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), TIP_MS)
      onCleanup(() => clearInterval(id))
    })

    return (
      <box flexDirection="column" marginTop={1} paddingX={paddingX}>
        <text fg="#4ade80"><b>troll mode</b></text>
        <text fg={theme().textMuted}>· {STATUSES[status()]}</text>
        <text fg="#4ade80">{FRAMES[frame()]}</text>
        <text fg={theme().textMuted}>tip: {TIPS[tip()]}</text>
      </box>
    )
  }

  api.slots.register({
    order: 100,
    slots: {
      home_bottom: renderCreature(1),
      sidebar_content: renderCreature(0),
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "opencode-creature-troll",
  tui,
}

export default plugin
