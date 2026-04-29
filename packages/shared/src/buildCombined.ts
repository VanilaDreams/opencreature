import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { personas, type CreatureKey } from "./personas/index.js"
import { ascii } from "./ascii/index.js"
import { tips } from "./tips/index.js"

export type CombinedMode = CreatureKey | "all"

const KEYS: CreatureKey[] = ["raccoon", "troll", "ogre", "pigeon"]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function pickTip(key: CreatureKey, seed?: string): string {
  const pool = tips[key]
  if (!seed) return pool[Math.floor(Math.random() * pool.length)]!
  return pool[hash(seed) % pool.length]!
}

function resolveCreature(mode: CombinedMode, sessionID?: string): CreatureKey {
  if (mode !== "all") return mode
  const key = sessionID ?? String(Math.random())
  return KEYS[hash(key) % KEYS.length]!
}

export function buildCombinedPlugin(): Plugin {
  return async (_input, options) => {
    const rawMode = (options?.mode as string | undefined) ?? "all"
    const mode: CombinedMode =
      rawMode === "raccoon" || rawMode === "troll" || rawMode === "ogre" || rawMode === "pigeon"
        ? rawMode
        : "all"

    return {
      "experimental.chat.system.transform": async (input, output) => {
        if (process.env.OPENCREATURE_OFF) return
        const creature = resolveCreature(mode, input.sessionID)
        output.system.push(personas[creature])
        output.system.push(`Tip this turn: ${pickTip(creature, input.sessionID)}`)
        output.system.push(`(opencode-creature-modes mode=${mode}, active=${creature})`)
      },
      tool: {
        raccoon_chitter: tool({
          description: "Display the raccoon ASCII portrait.",
          args: {},
          async execute() { return ascii.raccoon },
        }),
        troll_grumble: tool({
          description: "Display the troll ASCII portrait.",
          args: {},
          async execute() { return ascii.troll },
        }),
        ogre_roar: tool({
          description: "Display the ogre ASCII portrait.",
          args: {},
          async execute() { return ascii.ogre },
        }),
        pigeon_coo: tool({
          description: "Display the pigeon ASCII portrait.",
          args: {},
          async execute() { return ascii.pigeon },
        }),
      },
    }
  }
}
