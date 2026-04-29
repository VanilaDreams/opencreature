# opencode-creature-modes

OpenCode plugin. One plugin, four creatures. Pick a mode or let it rotate.

## Install

```json
// opencode.json
{
  "plugin": [
    ["opencode-creature-modes", { "mode": "raccoon" }]
  ]
}
```

`mode` accepts: `"raccoon" | "troll" | "ogre" | "pigeon" | "all"`. Default is `"all"` — rotates per session deterministically (each session is one creature, picked from the session ID).

```json
{ "plugin": ["opencode-creature-modes"] }
```

## What it does

- Reads `mode` from plugin options (the tuple form above).
- Injects the matching creature persona via `experimental.chat.system.transform`.
- Exposes all four ASCII tools: `raccoon_chitter`, `troll_grumble`, `ogre_roar`, `pigeon_coo`.
- Adds a rotating tip per turn.

## Kill switch

```bash
OPENCREATURE_OFF=1 opencode
```

## License

MIT
