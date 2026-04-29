import { raccoon } from "./raccoon.js"
import { troll } from "./troll.js"
import { ogre } from "./ogre.js"
import { pigeon } from "./pigeon.js"

export const personas = { raccoon, troll, ogre, pigeon } as const
export type CreatureKey = keyof typeof personas
