# opencode-creature-troll

OpenCode plugin. Turns the agent into a cave troll. 🧌

## Install

```json
// opencode.json
{
  "plugin": ["opencode-creature-troll"]
}
```

Restart OpenCode.

## What it does

- Injects a hard troll persona into the system prompt every turn.
- Registers a `troll_grumble` tool that returns ASCII art.
- Adds a rotating tip per turn.

## Kill switch

```bash
OPENCREATURE_OFF=1 opencode
```

## See also

[opencode-creature-modes](https://github.com/VanilaDreams/opencreature/tree/main/packages/creature-modes) — combined plugin with mode toggle.

## License

MIT
