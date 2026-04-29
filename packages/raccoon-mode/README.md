# opencode-creature-raccoon

OpenCode plugin. Turns the agent into a raccoon. 🦝

Two halves:

- **Server side** — injects raccoon persona into the system prompt every turn, registers the `raccoon_chitter` tool that returns ASCII art the model can drop into chat, and rotates a per-turn tip.
- **TUI side** — fills the `home_bottom` and `sidebar_content` slots with an animated SolidJS component: detailed multi-frame ASCII raccoon (eyes blink, mouth moves, tail wags) plus a rotating status line and a rotating tip every 12s.

## One-command install

```bash
opencode plugin opencode-creature-raccoon
```

This auto-populates `opencode.json` AND `tui.json` thanks to the `oc-plugin: ["server", "tui"]` declaration.

If the package isn't on npm yet, install from a local tarball — see [Local install](#local-install) below.

## opencode.json (manual install)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-creature-raccoon"]
}
```

Then restart OpenCode.

## Toggle off without uninstalling

```bash
OPENCREATURE_OFF=1 opencode
```

The persona, tool, and TUI sidebar are all suppressed for that shell.

## Local install

```bash
cd packages/raccoon-mode
bun install
bun run build
bun pm pack          # produces opencode-creature-raccoon-0.1.0.tgz
opencode plugin /absolute/path/to/opencode-creature-raccoon-0.1.0.tgz
```

## Publishing to npm

```bash
npm login
cd packages/raccoon-mode
bun run build
bun publish          # or: npm publish --access public
```

The build emits `dist/index.js` (server) and `dist/tui.js` (pre-compiled SolidJS for the TUI), both of which are listed in `package.json` `files`. The `oc-plugin: ["server", "tui"]` field tells OpenCode to load both targets.

## How the TUI plugin is built

The TUI source is `src/tui.tsx` with `/** @jsxImportSource @opentui/solid */`. The build step pre-compiles it via `babel-preset-solid` to `dist/tui.js`. The compiled `.js` imports concrete helpers (`createElement`, `insert`, `setProp`, `effect`) directly from the `@opentui/solid` package index — bypassing a bug in `@opentui/solid@0.2.0` where the `./jsx-runtime` export points at a `.d.ts` instead of a real implementation.

## License

MIT
