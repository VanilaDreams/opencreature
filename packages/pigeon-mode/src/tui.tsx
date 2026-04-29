/** @jsxImportSource @opentui/solid */
import { createEffect, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const FRAMES = [
  "  .--.  \n / o> \\ \n |    | \n  '--'  ",
  "  .--.  \n / -> \\ \n |    | \n  '--'  ",
  "  .--.  \n / o> \\ \n /|  |\\ \n  '--'  ",
]

const FRAME_MS = 400

const tui: TuiPlugin = async (api) => {
  if (process.env.OPENCREATURE_OFF) return

  api.slots.register({
    order: 100,
    slots: {
      home_bottom() {
        const [frame, setFrame] = createSignal(0)
        const theme = () => api.theme.current
        createEffect(() => {
          const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS)
          onCleanup(() => clearInterval(id))
        })
        return (
          <box flexDirection="column" marginTop={1} paddingX={1}>
            <text fg={theme().info}><b>🕊️  pigeon mode</b></text>
            <text fg={theme().textMuted}>{FRAMES[frame()]}</text>
          </box>
        )
      },
      sidebar_content() {
        const [frame, setFrame] = createSignal(0)
        const theme = () => api.theme.current
        createEffect(() => {
          const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS)
          onCleanup(() => clearInterval(id))
        })
        return (
          <box flexDirection="column" marginTop={1}>
            <text fg={theme().info}><b>🕊️  pigeon mode</b></text>
            <text fg={theme().textMuted}>{FRAMES[frame()]}</text>
          </box>
        )
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "opencode-creature-pigeon",
  tui,
}

export default plugin
