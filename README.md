# opencreature

Five OpenCode plugins that turn the agent into a creature, plus a standalone terminal toy.

| Package | What it is |
|---|---|
| [`opencode-creature-raccoon`](packages/raccoon-mode) | Hard raccoon-mode persona |
| [`opencode-creature-troll`](packages/troll-mode) | Hard troll-mode persona |
| [`opencode-creature-ogre`](packages/ogre-mode) | Hard ogre-mode persona |
| [`opencode-creature-pigeon`](packages/pigeon-mode) | Hard pigeon-mode persona |
| [`opencode-creature-modes`](packages/creature-modes) | Combined plugin, mode picked via plugin options |
| [`opencreature`](packages/cli) | Standalone CLI with animated ASCII creatures (no OpenCode required) |

## Install (per plugin)

After publishing to npm, add to your `opencode.json`:

```json
{
  "plugin": ["opencode-creature-raccoon"]
}
```

Or use the combined plugin and pick a mode:

```json
{
  "plugin": [
    ["opencode-creature-modes", { "mode": "ogre" }]
  ]
}
```

`mode` accepts `"raccoon" | "troll" | "ogre" | "pigeon" | "all"`. Default is `"all"` — rotates per session.

## Kill switch

Every plugin checks `OPENCREATURE_OFF` — if set, persona is suppressed for that shell.

```bash
OPENCREATURE_OFF=1 opencode
```

## Standalone terminal toy

```bash
npx opencreature              # rotate all
npx opencreature raccoon      # specific creature
npx opencreature --no-loop    # one frame, exit
```

Independent of OpenCode. Animated ASCII (blink, tail wag, wing flap).

## Develop

```bash
bun install
bun run build
bun run typecheck
```

Local test: point your `~/.config/opencode/opencode.json` at a built plugin's absolute path.

```json
{ "plugin": ["/absolute/path/to/opencreature/packages/raccoon-mode"] }
```

## What each plugin does

Server side (always on):
1. Inject persona prompt via `experimental.chat.system.transform` so the model speaks as the creature.
2. Register a custom tool (`raccoon_chitter` etc.) that returns ASCII art.
3. Add a rotating tip per turn.

TUI side (animated):
4. Fill `home_bottom` and `sidebar_content` slots with an animated SolidJS component — eyes blink, mouths move, frames cycle every 400ms.

Combined plugin reads `mode` from plugin options to pick the active creature; `mode: "all"` rotates per-session (server) and across creatures every 6s (TUI).

## Recommended install path

```bash
opencode plugin opencode-creature-raccoon
```

This populates both `opencode.json` (server) and `tui.json` (TUI) automatically based on the plugin's `oc-plugin: ["server", "tui"]` declaration.

## Implementation notes

The TUI plugin source is `.tsx` with `/** @jsxImportSource @opentui/solid */`. We pre-compile it to `.js` via `babel-preset-solid` (`scripts/build-tui.mjs`) so it imports concrete helpers from `@opentui/solid` directly. Without this step, OpenCode 1.14.29 fails to load TUI plugins because `@opentui/solid@0.2.0` exports `./jsx-runtime` to a `.d.ts` (declarations only). This pre-compilation step bypasses that bug.

## License

MIT
