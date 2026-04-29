/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"
import type { PluginOptions } from "@opencode-ai/plugin"

type Mode = "raccoon" | "troll" | "ogre" | "pigeon" | "all"

const CREATURES = {
  raccoon: {
    label: "🦝 raccoon mode",
    color: "secondary" as const,
    frames: [
      ".--.  .--.\n|o |..| o|\n \\  \\/  /\n  '-..-'",
      ".--.  .--.\n|- |..| -|\n \\  \\/  /\n  '-..-'",
      ".--.  .--.\n|o |..| o|\n \\  \\/  /\n  '-~~-'",
    ],
  },
  troll: {
    label: "🧌 troll mode",
    color: "success" as const,
    frames: [
      " .----. \n( O  O )\n |  -  |\n  '--' ",
      " .----. \n( -  - )\n |  -  |\n  '--' ",
      " .----. \n( O  O )\n | -- |\n  '--' ",
    ],
  },
  ogre: {
    label: "👹 ogre mode",
    color: "warning" as const,
    frames: [
      " .----. \n/o    o\\\n| /\\/\\ |\n \\____/ ",
      " .----. \n/o    o\\\n|VVVVVV|\n \\____/ ",
      " .----. \n/-    -\\\n| /\\/\\ |\n \\____/ ",
    ],
  },
  pigeon: {
    label: "🕊️  pigeon mode",
    color: "info" as const,
    frames: [
      "  .--.  \n / o> \\ \n |    | \n  '--'  ",
      "  .--.  \n / -> \\ \n |    | \n  '--'  ",
      "  .--.  \n / o> \\ \n /|  |\\ \n  '--'  ",
    ],
  },
}

const KEYS = Object.keys(CREATURES) as (keyof typeof CREATURES)[]
const FRAME_MS = 400
const ROTATE_MS = 6000

function buildTui(options: PluginOptions | undefined): TuiPlugin {
  const raw = (options?.mode as string | undefined) ?? "all"
  const mode: Mode = (KEYS as string[]).includes(raw) ? (raw as Mode) : "all"

  return async (api) => {
    if (process.env.OPENCREATURE_OFF) return

    const renderCreature = (slotPaddingX: number) => () => {
      const [frame, setFrame] = createSignal(0)
      const [creatureIndex, setCreatureIndex] = createSignal(0)
      const theme = () => api.theme.current

      const list = mode === "all" ? KEYS : [mode as keyof typeof CREATURES]
      const current = createMemo(() => CREATURES[list[creatureIndex() % list.length]!])

      createEffect(() => {
        const id = setInterval(() => {
          setFrame((f) => (f + 1) % current().frames.length)
        }, FRAME_MS)
        onCleanup(() => clearInterval(id))
      })

      createEffect(() => {
        if (list.length <= 1) return
        const id = setInterval(() => {
          setCreatureIndex((i) => i + 1)
          setFrame(0)
        }, ROTATE_MS)
        onCleanup(() => clearInterval(id))
      })

      const fg = createMemo(() => {
        const t = theme()
        const c = current().color
        return c === "secondary" ? t.secondary : c === "success" ? t.success : c === "warning" ? t.warning : t.info
      })

      return (
        <box flexDirection="column" marginTop={1} paddingX={slotPaddingX}>
          <text fg={fg()}><b>{current().label}</b></text>
          <text fg={theme().textMuted}>{current().frames[frame()]}</text>
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
}

const plugin: TuiPluginModule & { id: string } = {
  id: "opencode-creature-modes",
  tui: async (api, options, meta) => {
    const concrete = buildTui(options)
    await concrete(api, options, meta)
  },
}

export default plugin
