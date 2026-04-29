/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"
import type { PluginOptions } from "@opencode-ai/plugin"

type Mode = "raccoon" | "troll" | "ogre" | "pigeon" | "all"

type CreatureSpec = {
  label: string
  color: "secondary" | "success" | "warning" | "info"
  frames: string[]
  statuses: string[]
  tips: string[]
}

const CREATURES: Record<Exclude<Mode, "all">, CreatureSpec> = {
  raccoon: {
    label: "🦝 raccoon mode",
    color: "secondary",
    frames: [
`     .--._________.--.
    /  [##]   [##]   \\
   |    ___     ___    |
   |   ( o )   ( o )   |
   |    '-'     '-'    |
   |         ^         |
    \\      \\___/      /
     \\_______________/
        /|  WWWWW  |\\
       / |         | \\
      /__|_________|__\\
         \\\\\\     ///
          ~~~     ~~~`,
`     .--._________.--.
    /  [##]   [##]   \\
   |    ___     ___    |
   |   ( - )   ( - )   |
   |    '-'     '-'    |
   |         ^         |
    \\      \\___/      /
     \\_______________/
        /|  WWWWW  |\\
       / |         | \\
      /__|_________|__\\
          \\\\\\     ///
          ~~~      ~~~`,
`     .--._________.--.
    /  [##]   [##]   \\
   |    ___     ___    |
   |   ( O )   ( O )   |
   |    '-'     '-'    |
   |         v         |
    \\      \\---/      /
     \\_______________/
        /|  vvvvv  |\\
       / |         | \\
      /__|_________|__\\
         ///     \\\\\\
          ~~~     ~~~`,
    ],
    statuses: [
      "raccoons raiding the cache",
      "rummaging through node_modules",
      "found a shiny commit",
      "washing the diff",
      "scouting the dumpster fire",
    ],
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
    label: "🧌 troll mode",
    color: "success",
    frames: [
`       _________________
      /                 \\
     /     ___     ___    \\
    |    (.O.) ' (.O.)    |
    |       \\_____/       |
    |       |  W  |       |
     \\      '-----'      /
      \\_________________/
       /||\\         /||\\
      / || \\       / || \\
     /__||__\\     /__||__\\
        ||             ||
       /||\\           /||\\`,
`       _________________
      /                 \\
     /     ___     ___    \\
    |    (-O-) ' (-O-)    |
    |       \\_____/       |
    |       |  O  |       |
     \\      '-----'      /
      \\_________________/
       /||\\         /||\\
      / || \\       / || \\
     /__||__\\     /__||__\\
        ||             ||
       /||\\           /||\\`,
`       _________________
      /                 \\
     /     ___     ___    \\
    |    (*O*) ' (*O*)    |
    |       \\_____/       |
    |       | --- |       |
     \\      '-----'      /
      \\_________________/
       /||\\         /||\\
      / || \\       / || \\
     /__||__\\     /__||__\\
         ||           ||
        /||\\         /||\\`,
    ],
    statuses: [
      "troll under the bridge watching",
      "smashing rocks in code",
      "eyeing your refactor",
      "guarding the main branch",
      "grumpy about the build time",
    ],
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
    label: "👹 ogre mode",
    color: "warning",
    frames: [
`        ___________________
       /:::::::::::::::::::\\
      /:::                :::\\
     |::: (oo)        (oo) :::|
     |:::    \\___^^^___/    :::|
     |:::    | /VVVV\\ |    :::|
      \\:::   |  ww~ww  |   :::/
       \\:::__\\________/__:::/
       /::::            ::::\\
      /:::: ~~~~~~~~~~~~ ::::\\
     |::::                ::::|
      \\::::______________::::/
        ~~~~            ~~~~`,
`        ___________________
       /:::::::::::::::::::\\
      /:::                :::\\
     |::: (oO)        (Oo) :::|
     |:::    \\___^^^___/    :::|
     |:::    |\\WWWWWW/|    :::|
      \\:::   | ww~ww~  |   :::/
       \\:::__\\________/__:::/
       /::::            ::::\\
      /:::: ~~~~~~~~~~~~ ::::\\
     |::::                ::::|
      \\::::______________::::/
        ~~~~            ~~~~`,
`        ___________________
       /:::::::::::::::::::\\
      /:::                :::\\
     |::: (--)        (--) :::|
     |:::    \\___---___/    :::|
     |:::    | /VVVV\\ |    :::|
      \\:::   |  ww~ww  |   :::/
       \\:::__\\________/__:::/
       /::::            ::::\\
      /:::: ~~~~~~~~~~~~ ::::\\
     |::::                ::::|
      \\::::______________::::/
        ~~~~            ~~~~`,
    ],
    statuses: [
      "peeling onion abstractions",
      "swamp gas detected",
      "ogres do not premature-optimize",
      "layered like always",
      "fresh swamp water flowing",
    ],
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
    label: "🕊️  pigeon mode",
    color: "info",
    frames: [
`            _________
           /         \\
          |   .--.    |
          |  ( o )    |
          |   '--'____|___
          |   |        __>
           \\__|         /
              |________|
            /||        ||\\
           / ||        || \\
          /  ||________||  \\
         /__/|          |\\__\\
            ~~          ~~`,
`            _________
           /         \\
          |   .--.    |
          |  ( - )    |
          |   '--'____|___
          |   |       <__
           \\__|         \\
              |________|
            /||        ||\\
           / ||        || \\
          /__||________||__\\
              |          |
              ~~        ~~`,
`            _________
           /         \\
          |   .--.    |
          |  ( o )    |
          |   '--'____|___
          |   |       o__>
           \\__|         /
              |________|
           //||        ||\\\\
          // ||        || \\\\
         //  ||________||  \\\\
        //___|          |___\\\\
            ~~          ~~`,
    ],
    statuses: [
      "scanning ledges for crumbs",
      "spotting bugs from above",
      "head-bobbing through the diff",
      "suspicious of the new framework",
      "remembered something tangential",
    ],
    tips: [
      "crumb on line 47 — wait what was the question",
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
const FRAME_MS = 400
const STATUS_MS = 3500
const TIP_MS = 12000
const ROTATE_MS = 9000

function rand<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length)
}

const tui: TuiPlugin = async (api, options) => {
  if (process.env.OPENCREATURE_OFF) return

  const raw = (options?.mode as string | undefined) ?? "all"
  const mode: Mode = (KEYS as string[]).includes(raw) ? (raw as Mode) : "all"

  const renderCreature = (paddingX: number) => () => {
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

    const colorFg = createMemo(() => {
      const t = theme()
      const c = current().color
      return c === "secondary" ? t.secondary : c === "success" ? t.success : c === "warning" ? t.warning : t.info
    })

    return (
      <box flexDirection="column" marginTop={1} paddingX={paddingX}>
        <text fg={colorFg()}><b>{current().label}</b></text>
        <text fg={theme().textMuted}>· {current().statuses[status()]}</text>
        <text fg={colorFg()}>{current().frames[frame()]}</text>
        <text fg={theme().textMuted}>tip: {current().tips[tip()]}</text>
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
  id: "opencode-creature-modes",
  tui,
}

export default plugin
