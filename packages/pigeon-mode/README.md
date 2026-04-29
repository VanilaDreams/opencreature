# opencode-creature-pigeon

OpenCode plugin. Turns the agent into a city pigeon. 🕊️

Two halves:

- **Server side** — injects pigeon persona into the system prompt every turn (crumbs, ledges, flight), registers the `pigeon_coo` tool that returns ASCII art, and rotates a per-turn tip.
- **TUI side** — fills the `home_bottom` and `sidebar_content` slots with an animated SolidJS component: detailed multi-frame ASCII pigeon (head bob, beak open/close, wing flap) plus a rotating status line and a rotating tip every 12s.

## One-command install

```bash
opencode plugin opencode-creature-pigeon
```

Auto-populates `opencode.json` and `tui.json` thanks to `oc-plugin: ["server", "tui"]`.

## opencode.json (manual install)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-creature-pigeon"]
}
```

Restart OpenCode.

## Toggle off

```bash
OPENCREATURE_OFF=1 opencode
```

## Local install

```bash
cd packages/pigeon-mode
bun install
bun run build
bun pm pack
opencode plugin /absolute/path/to/opencode-creature-pigeon-0.1.0.tgz
```

## Publishing

```bash
npm login
cd packages/pigeon-mode
bun run build
bun publish
```

## How it's built

`src/tui.tsx` (with `/** @jsxImportSource @opentui/solid */`) is pre-compiled via `babel-preset-solid` to `dist/tui.js` so it imports concrete helpers from `@opentui/solid` directly — working around the broken `./jsx-runtime` export in `@opentui/solid@0.2.0`.

## License

MIT
