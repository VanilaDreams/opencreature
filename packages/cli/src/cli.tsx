import React, { useEffect, useState } from "react"
import { render, Box, Text, useApp, useInput } from "ink"
import { creatures, creatureKeys, type CreatureKey, type CreatureSpec } from "./frames/index.js"

type Mode = CreatureKey | "all"

type Args = {
  mode: Mode
  loop: boolean
}

function parseArgs(argv: string[]): Args {
  const args = argv.slice(2)
  const out: Args = { mode: "all", loop: true }
  for (const a of args) {
    if (a === "--no-loop") out.loop = false
    else if (a === "-h" || a === "--help") {
      console.log(
        "opencreature — animated terminal creatures\n\n" +
          "Usage:\n" +
          "  opencreature                 rotate all (default)\n" +
          "  opencreature <creature>      raccoon | troll | ogre | pigeon\n" +
          "  opencreature --no-loop       one full cycle then exit\n",
      )
      process.exit(0)
    } else if (creatureKeys.includes(a as CreatureKey)) {
      out.mode = a as CreatureKey
    } else if (a.startsWith("-")) {
      console.error(`unknown flag: ${a}`)
      process.exit(1)
    } else {
      console.error(`unknown creature: ${a} (try raccoon, troll, ogre, pigeon)`)
      process.exit(1)
    }
  }
  return out
}

const FRAME_MS = 380
const ROTATE_MS = 4500

function App({ mode, loop }: Args) {
  const { exit } = useApp()
  const [creatureIndex, setCreatureIndex] = useState(0)
  const [frameIndex, setFrameIndex] = useState(0)
  const [cycles, setCycles] = useState(0)

  const list: CreatureSpec[] =
    mode === "all" ? creatureKeys.map((k) => creatures[k]) : [creatures[mode]]

  const current = list[creatureIndex % list.length]!
  const frame = current.frames[frameIndex % current.frames.length]!

  useInput((_input, key) => {
    if (key.escape || _input === "q") exit()
  })

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex((i) => {
        const next = i + 1
        if (!loop && mode !== "all" && next >= current.frames.length) {
          exit()
        }
        return next
      })
    }, FRAME_MS)
    return () => clearInterval(id)
  }, [exit, loop, mode, current.frames.length])

  useEffect(() => {
    if (mode !== "all") return
    const id = setInterval(() => {
      setCreatureIndex((i) => {
        const next = i + 1
        if (!loop && next >= list.length) {
          exit()
          return i
        }
        return next
      })
      setCycles((c) => c + 1)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [exit, loop, mode, list.length])

  void cycles

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={current.color} bold>
          {current.label}
        </Text>
        <Text dimColor>  ·  press q to quit</Text>
      </Box>
      <Box>
        <Text color={current.color}>{frame}</Text>
      </Box>
    </Box>
  )
}

const args = parseArgs(process.argv)
render(<App {...args} />)
