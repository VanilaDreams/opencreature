/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"
import type { PluginOptions } from "@opencode-ai/plugin"

type Mode = "raccoon" | "troll" | "ogre" | "pigeon" | "all"

type CreatureSpec = {
  name: string
  title: string
  tagline: string
  fg: string
  miniArt: string
  fullArt: string
  attribution: string
  thinkingTop: string
  thinkingBottom: string
  tipLabel: string
  statuses: string[]
  tips: string[]
}

const DOTS = ".".repeat(56)

const CREATURES: Record<Exclude<Mode, "all">, CreatureSpec> = {
  raccoon: {
    name: "raccoon",
    title: "RACCOON MODE",
    tagline: "shiny trash welcome",
    fg: "#fbbf24",
    miniArt:
` _,_,_
<=o.o=>
 /|_|\\
  \\-/`,
    fullArt:
`                   __        .-.
               .-"\` .\`'.    /\\|
       _(\\-/)_" ,  .   ,\\  /\\\\\\/
      {(#b^d#)} .   ./,  |/\\\\\\/
      \`-.(Y).-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==\`==\`   ==\`   ==\``,
    attribution: "art: jgs",
    thinkingTop: "raccoon is thinking",
    thinkingBottom: "eyes on the cache",
    tipLabel: "Raccoon Tip",
    statuses: [
      "raccoons in the cache · gremlins in the gears",
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
    name: "troll",
    title: "TROLL MODE",
    tagline: "rocks ahead",
    fg: "#84cc16",
    miniArt:
`\\\\,//
<O.O>
/|_|\\
 | |`,
    fullArt:
`      -. -. \`.  / .-' _.'  _
     .--\`. \`. \`| / __.-- _' \`
    '.-.  \\  \\ |  /   _.' \`_
    .-. \\  \`  || |  .' _.-' \`.
  .' _ \\ '  -    -'  - \` _.-.
   .' \`. %%%%%   | %%%%% _.-.\`-
 .' .-. ><(@)> ) ( <(@)>< .-.\`.
   (("\`(   -   | |   -   )'"))
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
    attribution: "art: VK",
    thinkingTop: "troll is thinking",
    thinkingBottom: "eyes on the bridge",
    tipLabel: "Troll Tip",
    statuses: [
      "troll under the bridge · rocks in the cache",
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
    name: "ogre",
    title: "OGRE MODE",
    tagline: "swamp's open",
    fg: "#a3e635",
    miniArt:
` .---.
(O.O.O)
  /|\\
  / \\`,
    fullArt:
`          c,_.--.,y
            7 a.a(
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
    attribution: "art: snd",
    thinkingTop: "ogre is thinking",
    thinkingBottom: "eyes on the layers",
    tipLabel: "Ogre Tip",
    statuses: [
      "ogres in the swamp · onions in the diff",
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
    name: "pigeon",
    title: "PIGEON MODE",
    tagline: "crumbs welcome",
    fg: "#22d3ee",
    miniArt:
`  _,
 (o<
  ))
  \\\\`,
    fullArt:
`                          .---.
                         /  (o \\_
                         | -='.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ,-'==,\\
                          ,-\`==;`,
    attribution: "art: jgs",
    thinkingTop: "pigeon is thinking",
    thinkingBottom: "eyes on the ledge",
    tipLabel: "Pigeon Tip",
    statuses: [
      "pigeons on the ledge · crumbs in the queue",
      "spotting bugs from above",
      "head-bobbing through the diff",
      "suspicious of the new framework",
      "remembered something tangential",
    ],
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
const STATUS_MS = 3500
const TIP_MS = 12000
const ROTATE_MS = 11000

function rand<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length)
}

function pickCreature(mode: Mode, sessionSeed: number): keyof typeof CREATURES {
  if (mode !== "all") return mode
  return KEYS[sessionSeed % KEYS.length]!
}

const tui: TuiPlugin = async (api, options) => {
  if (process.env.OPENCREATURE_OFF) return

  const raw = (options?.mode as string | undefined) ?? "all"
  const mode: Mode = (KEYS as string[]).includes(raw) ? (raw as Mode) : "all"

  const useState = () => {
    const [creatureIndex, setCreatureIndex] = createSignal(0)
    const [status, setStatus] = createSignal(0)
    const [tip, setTip] = createSignal(0)
    const theme = () => api.theme.current

    const list = mode === "all" ? KEYS : [mode as keyof typeof CREATURES]
    const current = createMemo(() => CREATURES[list[creatureIndex() % list.length]!])

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
        setStatus(0)
      }, ROTATE_MS)
      onCleanup(() => clearInterval(id))
    })

    return { current, status, tip, theme }
  }

  api.slots.register({
    order: 100,
    slots: {
      home_bottom: () => {
        const { current, status, theme } = useState()
        const miniLines = createMemo(() => current().miniArt.split("\n"))
        return (
          <box flexDirection="column" alignItems="center" marginTop={1} marginBottom={1}>
            <text fg={current().fg}><b>{current().title}</b></text>
            <text fg={theme().textMuted}>{current().tagline}</text>
            <text> </text>
            <For each={miniLines()}>
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
      sidebar_content: () => {
        const { current } = useState()
        const fullLines = createMemo(() => current().fullArt.split("\n"))
        return (
          <box flexDirection="column" marginTop={1} paddingX={1}>
            <For each={fullLines()}>
              {(line) => <text fg={current().fg}>{line}</text>}
            </For>
            <text> </text>
            <text fg={current().fg}>{current().thinkingTop}</text>
            <text fg={current().fg}>{current().thinkingBottom}</text>
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
