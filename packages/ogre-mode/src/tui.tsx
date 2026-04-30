/** @jsxImportSource @opentui/solid */
import { createEffect, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const FRAMES = [
`        ____^____
       /         \\
      /           \\
     |   O     O   |
     |             |
     |     /\\      |
     |    /  \\     |
     |    \\__/     |
     |  uu     uu  |
      \\           /
       \\_________/
          ~ ~ ~`,
`        ____^____
       /         \\
      /           \\
     |   -     -   |
     |             |
     |     /\\      |
     |    /  \\     |
     |    \\__/     |
     |  uu     uu  |
      \\           /
       \\_________/
          ~ ~ ~`,
`        ____^____
       /         \\
      /           \\
     |   ^     ^   |
     |             |
     |     /\\      |
     |    /  \\     |
     |    \\__/     |
     | UUU     UUU |
      \\           /
       \\_________/
          ~ ~ ~`,
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

const FRAME_MS = 420
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
        <text fg="#a3e635"><b>ogre mode</b></text>
        <text fg={theme().textMuted}>· {STATUSES[status()]}</text>
        <text fg="#a3e635">{FRAMES[frame()]}</text>
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
  id: "opencode-creature-ogre",
  tui,
}

export default plugin
