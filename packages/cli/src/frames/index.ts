import { raccoonFrames, raccoonLabel, raccoonColor } from "./raccoon.js"
import { trollFrames, trollLabel, trollColor } from "./troll.js"
import { ogreFrames, ogreLabel, ogreColor } from "./ogre.js"
import { pigeonFrames, pigeonLabel, pigeonColor } from "./pigeon.js"

export type CreatureKey = "raccoon" | "troll" | "ogre" | "pigeon"

export type CreatureSpec = {
  key: CreatureKey
  label: string
  color: string
  frames: string[]
}

export const creatures: Record<CreatureKey, CreatureSpec> = {
  raccoon: { key: "raccoon", label: raccoonLabel, color: raccoonColor, frames: raccoonFrames },
  troll: { key: "troll", label: trollLabel, color: trollColor, frames: trollFrames },
  ogre: { key: "ogre", label: ogreLabel, color: ogreColor, frames: ogreFrames },
  pigeon: { key: "pigeon", label: pigeonLabel, color: pigeonColor, frames: pigeonFrames },
}

export const creatureKeys: CreatureKey[] = ["raccoon", "troll", "ogre", "pigeon"]
