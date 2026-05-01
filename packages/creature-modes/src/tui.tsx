/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"
import type { PluginOptions } from "@opencode-ai/plugin"

type Mode = "raccoon" | "troll" | "ogre" | "pigeon" | "all"

type CreatureSpec = {
  title: string
  tagline: string
  fg: string
  frames: string[]
  statuses: string[]
  tipLabel: string
  tips: string[]
}

const DOTS = ".".repeat(56)
const FRAME_MS = 600
const STATUS_MS = 4000
const TIP_MS = 12000
const ROTATE_MS = 11000

const CREATURES: Record<Exclude<Mode, "all">, CreatureSpec> = {
  raccoon: {
    title: "RACCOON MODE",
    tagline: "shiny trash welcome",
    fg: "#a3e635",
    frames: [
` _,_,_
<=o.o=>
 /|_|\\
  \\ /`,
` _,_,_
<=-.-=>
 /|_|\\
  \\ /`,
` _,_,_
<=o.o=>
 /|_|\\
  \\_/`,
    ],
    statuses: [
      "raccoons in the cache · gremlins in the gears",
      "rummaging through node_modules",
      "found a shiny commit",
      "washing the diff",
      "scouting the dumpster fire",
    ],
    tipLabel: "Raccoon Tip",
    tips: [
      "always wash your data before consuming it",
      "the best bugs are found at 3am behind the dumpster",
      "if it shines, take it. if it tests, ship it",
      "trash today, treasure in next week's PR",
      "five small commits beat one big rummage",
      "logs are just shiny trash with timestamps",
      "every refactor is a new den",
    ],
  },
  troll: {
    title: "TROLL MODE",
    tagline: "rocks ahead",
    fg: "#84cc16",
    frames: [
`\\\\,//
<O.O>
/|_|\\
 | |`,
`\\\\,//
<-.->
/|_|\\
 | |`,
`\\\\,//
<O.O>
/|_|\\
 |_|`,
    ],
    statuses: [
      "troll under the bridge · rocks in the cache",
      "smashing rocks in code",
      "eyeing your refactor",
      "guarding the main branch",
      "grumpy about the build time",
    ],
    tipLabel: "Troll Tip",
    tips: [
      "code work or code not work. no in between",
      "if test fail, smash test until pass. wait. that bad. fix code instead",
      "abstraction is rock with extra steps",
      "delete more code than you write today",
      "tabs vs spaces. troll use whatever editor pick",
      "premature optimization is rock you trip on",
      "READ error message. all of it. yes the long part too",
    ],
  },
  ogre: {
    title: "OGRE MODE",
    tagline: "swamp's open",
    fg: "#65a30d",
    frames: [
` .---.
(O.O.O)
  /|\\
  / \\`,
` .---.
(-.-.-)
  /|\\
  / \\`,
` .---.
(O.O.O)
  /|\\
  \\ /`,
    ],
    statuses: [
      "ogres in the swamp · onions in the diff",
      "swamp gas detected",
      "ogres do not premature-optimize",
      "layered like always",
      "fresh swamp water flowing",
    ],
    tipLabel: "Ogre Tip",
    tips: [
      "code is like onions. layers. you peel and you cry",
      "fresh swamp water is better than stale swamp water",
      "ogres do not split twenty-line files into five files",
      "the old swamp had reasons. respect the old swamp",
      "if abstraction has only one user, it is not abstraction. it is detour",
      "comments explain why. names explain what. ogre tired",
      "deploy on friday. live with the consequences",
    ],
  },
  pigeon: {
    title: "PIGEON MODE",
    tagline: "crumbs welcome",
    fg: "#22d3ee",
    frames: [
` ,_,
(o.o)
 /v\\
 | |`,
` ,_,
(-.-)
 /v\\
 | |`,
` ,_,
(o.o)
 /v\\
 |_|`,
    ],
    statuses: [
      "pigeons on the ledge · crumbs in the queue",
      "spotting bugs from above",
      "head-bobbing through the diff",
      "suspicious of the new framework",
      "remembered something tangential",
    ],
    tipLabel: "Pigeon Tip",
    tips: [
      "crumb on line 47, wait what was the question",
      "every endpoint is a feeding station. some give bread. some give panic",
      "small commits are easier to peck through",
      "git blame is just bird-watching with extra steps",
      "shiny new framework? hmm. coo. suspicious",
      "logs are crumbs. follow them home",
      "deployment is taking flight. flight is mostly falling on purpose",
    ],
  },
}

const KEYS = Object.keys(CREATURES) as (keyof typeof CREATURES)[]

function rand<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length)
}

const tui: TuiPlugin = async (api, options) => {
  if (process.env.OPENCREATURE_OFF) return

  const raw = (options?.mode as string | undefined) ?? "all"
  const mode: Mode = (KEYS as string[]).includes(raw) ? (raw as Mode) : "all"

  const useState = () => {
    const [creatureIndex, setCreatureIndex] = createSignal(0)
    const [frame, setFrame] = createSignal(0)
    const [status, setStatus] = createSignal(0)
    const [tip, setTip] = createSignal(0)
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
      const id = setInterval(() => {
        setStatus((s) => (s + 1) % current().statuses.length)
      }, STATUS_MS)
      onCleanup(() => clearInterval(id))
    })

    createEffect(() => {
      setTip(rand(current().tips))
      const id = setInterval(() => {
        setTip((t) => (t + 1) % current().tips.length)
      }, TIP_MS)
      onCleanup(() => clearInterval(id))
    })

    createEffect(() => {
      if (list.length <= 1) return
      const id = setInterval(() => {
        setCreatureIndex((i) => i + 1)
        setFrame(0)
        setStatus(0)
      }, ROTATE_MS)
      onCleanup(() => clearInterval(id))
    })

    return { current, frame, status, tip, theme }
  }

  api.slots.register({
    order: 100,
    slots: {
      home_bottom: () => {
        const { current, frame, status, theme } = useState()
        const lines = createMemo(() => current().frames[frame()]!.split("\n"))
        return (
          <box flexDirection="column" alignItems="center" marginTop={2} marginBottom={1}>
            <text fg={current().fg}><b>{current().title}</b></text>
            <text fg={theme().textMuted}>{current().tagline}</text>
            <text> </text>
            <For each={lines()}>
              {(line) => <text fg={current().fg}>{line}</text>}
            </For>
            <text> </text>
            <text fg={theme().textMuted}>{DOTS}</text>
            <text> </text>
            <text fg={theme().textMuted}>{current().statuses[status()]}</text>
          </box>
        )
      },
      home_footer: () => {
        const { current, tip, theme } = useState()
        return (
          <box flexDirection="row" alignItems="center" justifyContent="center" marginTop={1}>
            <text fg={current().fg}>~ {current().tipLabel} </text>
            <text fg={theme().textMuted}>{current().tips[tip()]}</text>
          </box>
        )
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "opencode-creature-modes",
  tui,
}

export default plugin
