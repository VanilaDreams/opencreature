/** @jsxImportSource @opentui/solid */
import { createEffect, createMemo, createSignal, onCleanup, For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"
import type { PluginOptions } from "@opencode-ai/plugin"

type Mode = "raccoon" | "troll" | "ogre" | "pigeon" | "all"

type Palette = Record<string, string>

type CreatureSpec = {
  label: string
  defaultFg: string
  palette: Palette
  frames: string[]
  statuses: string[]
  tips: string[]
  attribution: string
}

// Color markers using ASCII control chars that never appear in ASCII art.
// \x01 = start of colored span, followed by single-char tag, then content,
// terminated by \x02. Plain text outside markers uses defaultFg.
const C_START = "\x01"
const C_END = "\x02"
function tag(name: string) {
  return (s: string) => C_START + name + s + C_END
}
const e = tag("e") // eye
const m = tag("m") // mask / hair / dark accent
const n = tag("n") // nose / mouth / pop
const t = tag("t") // tail / feet / secondary

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

const CREATURES: Record<Exclude<Mode, "all">, CreatureSpec> = {
  raccoon: {
    label: "raccoon mode",
    defaultFg: "#c4a484",
    palette: {
      e: "#fbbf24",
      m: "#1f2937",
      n: "#ef4444",
      t: "#78716c",
    },
    attribution: "art: jgs (Joan Stark, 1997)",
    frames: [
      `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("^")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
      `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("_")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
      `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("o")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(o)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
      `                   __        .-.
               .-"\` .\`'.    /\\|
       _(${m("\\-/")})_" ,  .   ,\\  /\\\\\\/
      {(#b${e("*")}d#)} .   ./,  |/\\\\\\/
      \`-.${n("(Y)")}.-\`  ,  |  , |\\.-\`
           /~/,_/~~~\\,__.-\`
          ////~    // ~\\\\
  jgs   ==${t("\`")}==${t("\`")}   ==${t("\`")}   ==${t("\`")}`,
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
    label: "troll mode",
    defaultFg: "#65a30d",
    palette: {
      e: "#f97316",
      m: "#1c1917",
      n: "#dc2626",
      t: "#3f3f46",
    },
    attribution: "art: VK (Veronica Karlsson)",
    frames: [
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
( ( ( ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
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
( ( ( ) ( ) ) ( ) ) ( ) ) ) ( ) )`,
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
    label: "ogre mode",
    defaultFg: "#84cc16",
    palette: {
      e: "#fef3c7",
      m: "#365314",
      n: "#a3e635",
      t: "#3f6212",
    },
    attribution: "art: snd (Shanaka Dias)",
    frames: [
      `          c,_.--.,y
            7 ${e("a.a")}(
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
      `          c,_.--.,y
            7 ${e("-.-")}(
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
      `          c,_.--.,y
            7 ${e("o.o")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  ${n("o")} (
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
      `          c,_.--.,y
            7 ${e("O.O")}(
           (   ,_Y)
           :  '---;
       ___.'\\.  ${n("v")} (
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
    label: "pigeon mode",
    defaultFg: "#67e8f9",
    palette: {
      e: "#fef08a",
      m: "#52525b",
      n: "#fb923c",
      t: "#475569",
    },
    attribution: "art: jgs (Joan Stark, 1997)",
    frames: [
      `                          .---.
                         /  ${e("(o")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
      `                          .---.
                         /  ${e("(-")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
      `                          .---.
                         /  ${e("(O")} \\_
                         | ${n("-o")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
      `                          .---.
                         /  ${e("(o")} \\_
                         | ${n("-=")}'.'"\`
                         )   (
                     _.=\`     \\
                 _.=\`.   -.    |
            .===:._ ' '.   ;   |
 ________,.='\`^~""\`\`"====-'   ,'
'-========-""'"-=..,,,_____,.'
                      \`\\ \`\\
        jgs          ${t(",-'==,\\")}
                          ${t(",-\`==;")}`,
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
const FRAME_MS = 350
const STATUS_MS = 3500
const TIP_MS = 12000
const ROTATE_MS = 11000

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

    const lines = createMemo(() => current().frames[frame()]!.split("\n"))

    return (
      <box flexDirection="column" marginTop={1} paddingX={paddingX}>
        <text fg={current().defaultFg}><b>{current().label}</b></text>
        <text fg={theme().textMuted}>· {current().statuses[status()]}</text>
        <For each={lines()}>
          {(line) => (
            <text>
              <For each={parseSegments(line, current().palette, current().defaultFg)}>
                {(s) => <span {...({ fg: s.fg } as any)}>{s.text}</span>}
              </For>
            </text>
          )}
        </For>
        <text fg={theme().textMuted}>{current().attribution}</text>
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
