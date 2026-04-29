# opencode-creature-ogre

OpenCode plugin. Turns the agent into a swamp ogre. 👹

## Install

```json
// opencode.json
{
  "plugin": ["opencode-creature-ogre"]
}
```

Restart OpenCode.

## What it does

- Injects a hard ogre persona into the system prompt every turn.
- Registers an `ogre_roar` tool that returns ASCII art.
- Adds a rotating tip per turn.

## Kill switch

```bash
OPENCREATURE_OFF=1 opencode
```

## See also

[opencode-creature-modes](https://github.com/VanilaDreams/opencreature/tree/main/packages/creature-modes) — combined plugin with mode toggle.

## License

MIT
