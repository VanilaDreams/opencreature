export type TuiCreatureKey = "raccoon" | "troll" | "ogre" | "pigeon"

export type TuiCreatureSpec = {
  label: string
  themeColor: "primary" | "accent" | "warning" | "success" | "info" | "secondary"
  frames: string[]
}

export const tuiCreatures: Record<TuiCreatureKey, TuiCreatureSpec> = {
  raccoon: {
    label: "raccoon",
    themeColor: "secondary",
    frames: [
      ".--.  .--.\n|o |..| o|\n \\  \\/  /\n  '-..-'",
      ".--.  .--.\n|- |..| -|\n \\  \\/  /\n  '-..-'",
      ".--.  .--.\n|o |..| o|\n \\  \\/  /\n  '-~~-'",
    ],
  },
  troll: {
    label: "troll",
    themeColor: "success",
    frames: [
      " .----. \n( O  O )\n |  -  |\n  '--' ",
      " .----. \n( -  - )\n |  -  |\n  '--' ",
      " .----. \n( O  O )\n | -- |\n  '--' ",
    ],
  },
  ogre: {
    label: "ogre",
    themeColor: "warning",
    frames: [
      " .----. \n/o    o\\\n| /\\/\\ |\n \\____/ ",
      " .----. \n/o    o\\\n|VVVVVV|\n \\____/ ",
      " .----. \n/-    -\\\n| /\\/\\ |\n \\____/ ",
    ],
  },
  pigeon: {
    label: "pigeon",
    themeColor: "info",
    frames: [
      "  .--.  \n / o> \\ \n |    | \n  '--'  ",
      "  .--.  \n / -> \\ \n |    | \n  '--'  ",
      "  .--.  \n / o> \\ \n /|  |\\ \n  '--'  ",
    ],
  },
}
