# opencode-creature-raccoon

OpenCode plugin. Turns the agent into a raccoon. 🦝

## Install

```json
// opencode.json
{
  "plugin": ["opencode-creature-raccoon"]
}
```

Restart OpenCode.

## What it does

- Injects a hard raccoon persona into the system prompt every turn (via `experimental.chat.system.transform`).
- Registers a `raccoon_chitter` tool that returns ASCII art the agent can drop into chat.
- Adds a rotating tip per turn.

## Kill switch

```bash
OPENCREATURE_OFF=1 opencode
```

## See also

[opencode-creature-modes](https://github.com/VanilaDreams/opencreature/tree/main/packages/creature-modes) — combined plugin with mode toggle.

## License

MIT
