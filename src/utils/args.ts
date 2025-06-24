import type { SupportedArgs } from "../types";

export const parseArgs = (args: string[]): SupportedArgs => {
  const result: SupportedArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      // Supported path arguments: "-p" and "-path".
      case "-p":
      case "-path":
        result.path = args[i + 1];
        i++;
        break;
      // Supported color arguments: "-c" and "-color".
      case "-c":
      case "-color":
        result.color = args[i + 1];
        i++;
        break;
      default:
        if (args[i]?.startsWith("-")) {
          console.warn(`Unknown argument: ${args[i]}.`);
        }
        break;
    }
  }

  return result;
};
