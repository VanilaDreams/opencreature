# opencode-creature-pigeon

OpenCode plugin. Turns the agent into a city pigeon. 🕊️

## Install

```json
// opencode.json
{
  "plugin": ["opencode-creature-pigeon"]
}
```

Restart OpenCode.

## What it does

- Injects a hard pigeon persona into the system prompt every turn.
- Registers a `pigeon_coo` tool that returns ASCII art.
- Adds a rotating tip per turn.

## Kill switch

```bash
OPENCREATURE_OFF=1 opencode
```

## See also

[opencode-creature-modes](https://github.com/VanilaDreams/opencreature/tree/main/packages/creature-modes) — combined plugin with mode toggle.

## License

MIT
