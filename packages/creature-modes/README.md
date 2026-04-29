# opencode-creature-modes

OpenCode plugin. One plugin, four creatures, toggle via config.

Combines raccoon, troll, ogre, and pigeon modes into a single plugin. Pick one creature for the whole project, or set `mode: "all"` and let the plugin rotate through them per session.

## One-command install

```bash
opencode plugin opencode-creature-modes
```

Auto-populates `opencode.json` and `tui.json` thanks to `oc-plugin: ["server", "tui"]`.

## Toggle modes via opencode.json

Use the **tuple form** for the `plugin` array entry — `["package-name", { ...options }]`. OpenCode passes the options object as the second argument to the plugin function.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["opencode-creature-modes", { "mode": "raccoon" }]
  ]
}
```

Valid `mode` values:

- `"raccoon"` — full raccoon persona, raccoon ASCII in the TUI
- `"troll"` — full troll persona
- `"ogre"` — full swamp-ogre persona
- `"pigeon"` — full pigeon persona
- `"all"` *(default)* — server side picks one creature per session deterministically (same `sessionID` → same creature for the whole session); TUI rotates through all four creatures every ~9 seconds

```json
// short form: defaults to mode="all"
{
  "plugin": ["opencode-creature-modes"]
}
```

Restart OpenCode after editing config.

## Toggle off

```bash
OPENCREATURE_OFF=1 opencode
```

The persona, tools, and TUI sidebar are all suppressed for that shell.

## Local install

```bash
cd packages/creature-modes
bun install
bun run build
bun pm pack
opencode plugin /absolute/path/to/opencode-creature-modes-0.1.0.tgz
```

## Publishing

```bash
npm login
cd packages/creature-modes
bun run build
bun publish
```

## How it's built

`src/tui.tsx` (with `/** @jsxImportSource @opentui/solid */`) is pre-compiled via `babel-preset-solid` to `dist/tui.js` so it imports concrete helpers from `@opentui/solid` directly — working around the broken `./jsx-runtime` export in `@opentui/solid@0.2.0`.

The TUI plugin reads its `mode` from the second argument (`PluginOptions`). The same options also reach the server plugin, where it controls persona selection.

## License

MIT
