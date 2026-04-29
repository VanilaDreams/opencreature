/** @jsxImportSource @opentui/solid */
import { createEffect, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const FRAMES = [
`       ___________
      /           \\
     |  o       o  |
     |     /\\      |
     |     \\/      |
      \\           /
       \\_________/
          |   |
         /     \\
        /       \\
       |_________|
        ||     ||`,
`       ___________
      /           \\
     |  -       -  |
     |     /\\      |
     |     \\/      |
      \\           /
       \\_________/
          |   |
         /     \\
        /       \\
       |_________|
        ||     ||`,
`       ___________
      /           \\
     |  O       O  |
     |     /v\\     |
     |     \\^/     |
      \\           /
       \\_________/
          |   |
         /     \\
        /       \\
       |_________|
        ||     ||`,
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

const FRAME_MS = 360
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
        <text fg={theme().info}><b>🕊️  pigeon mode</b></text>
        <text fg={theme().textMuted}>· {STATUSES[status()]}</text>
        <text fg={theme().info}>{FRAMES[frame()]}</text>
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
  id: "opencode-creature-pigeon",
  tui,
}

export default plugin
