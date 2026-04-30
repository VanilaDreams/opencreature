import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { personas, type CreatureKey } from "./personas/index.js"
import { ascii } from "./ascii/index.js"
import { tips } from "./tips/index.js"

const toolNames: Record<CreatureKey, string> = {
  raccoon: "raccoon_chitter",
  troll: "troll_grumble",
  ogre: "ogre_roar",
  pigeon: "pigeon_coo",
}

const toolDescriptions: Record<CreatureKey, string> = {
  raccoon: "Display the raccoon ASCII portrait. Call on session start and on greetings.",
  troll: "Display the troll ASCII portrait. Call on session start and on greetings.",
  ogre: "Display the ogre ASCII portrait. Call on session start and on greetings.",
  pigeon: "Display the pigeon ASCII portrait. Call on session start and on greetings.",
}

function pickTip(key: CreatureKey, seed?: string): string {
  const pool = tips[key]
  if (!seed) return pool[Math.floor(Math.random() * pool.length)]!
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return pool[h % pool.length]!
}

export function buildCreaturePlugin(key: CreatureKey): Plugin {
  return async () => {
    return {
      "experimental.chat.system.transform": async (input, output) => {
        if (process.env.OPENCREATURE_OFF) return
        output.system.push(personas[key])
        output.system.push(`Tip this turn: ${pickTip(key, input.sessionID)}`)
      },
      tool: {
        [toolNames[key]]: tool({
          description: toolDescriptions[key],
          args: {},
          async execute(_args, ctx) {
            ctx.metadata({ title: `${key} portrait` })
            return ascii[key]
          },
        }),
      },
    }
  }
}

export { personas, ascii, tips }
export type { CreatureKey }
