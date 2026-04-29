import { transformAsync } from "@babel/core"
import solid from "babel-preset-solid"
import ts from "@babel/preset-typescript"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const [, , inputArg, outputArg] = process.argv
if (!inputArg || !outputArg) {
  console.error("usage: build-tui.mjs <input.tsx> <output.js>")
  process.exit(1)
}

const input = resolve(inputArg)
const output = resolve(outputArg)

const source = await readFile(input, "utf8")

const result = await transformAsync(source, {
  filename: input,
  configFile: false,
  babelrc: false,
  presets: [
    [solid, { moduleName: "@opentui/solid", generate: "universal" }],
    [ts, { isTSX: true, allExtensions: true }],
  ],
})

if (!result?.code) {
  throw new Error("babel produced no output")
}

await mkdir(dirname(output), { recursive: true })
await writeFile(output, result.code)
console.log(`built ${input} → ${output} (${result.code.length} bytes)`)
