/** @jsxImportSource @opentui/solid */
import { createEffect, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const FRAMES = [
`      /\\         /\\
     /  \\_______/  \\
    /               \\
    |  ===     ===  |
    |  =o=     =o=  |
    |  ===     ===  |
    |       v       |
    |      '-'      |
     \\             /
      \\___________/
        /|     |\\
       __|     |__`,
`      /\\         /\\
     /  \\_______/  \\
    /               \\
    |  ===     ===  |
    |  =-=     =-=  |
    |  ===     ===  |
    |       v       |
    |      '-'      |
     \\             /
      \\___________/
        /|     |\\
       __|     |__`,
`      /\\         /\\
     /  \\_______/  \\
    /               \\
    |  ===     ===  |
    |  =O=     =O=  |
    |  ===     ===  |
    |       v       |
    |      \\_/      |
     \\             /
      \\___________/
        /|     |\\
       __|     |__`,
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

const FRAME_MS = 380
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
        <text fg="#f59e0b"><b>raccoon mode</b></text>
        <text fg={theme().textMuted}>· {STATUSES[status()]}</text>
        <text fg="#f59e0b">{FRAMES[frame()]}</text>
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
  id: "opencode-creature-raccoon",
  tui,
}

export default plugin
