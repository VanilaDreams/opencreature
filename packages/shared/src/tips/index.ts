import { raccoonTips } from "./raccoon.js"
import { trollTips } from "./troll.js"
import { ogreTips } from "./ogre.js"
import { pigeonTips } from "./pigeon.js"

export const tips = {
  raccoon: raccoonTips,
  troll: trollTips,
  ogre: ogreTips,
  pigeon: pigeonTips,
} as const
