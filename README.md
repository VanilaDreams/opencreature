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

## Honest scope

What plugins actually do, given the real OpenCode plugin API:

1. Inject persona prompt via `experimental.chat.system.transform` so the model speaks as the creature.
2. Register a custom tool (`raccoon_chitter` etc.) that returns ASCII art the model can drop into chat.
3. Combined plugin reads its `mode` option from `opencode.json`.

Out of scope: animated chat banners, sidebar widgets, replacing the chat input. The OpenCode TUI is now SolidJS + opentui — TUI plugin extension exists but is not built here. The standalone `opencreature` CLI covers the animated-ASCII vibe in a side terminal.

## License

MIT
