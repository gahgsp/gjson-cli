export const parseArgs = (args: string[]): Record<string, string> => {
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const currArg = args[i];

    if (currArg && currArg.startsWith("-") && currArg.length === 2) {
      const key = currArg[1]; // We take only the key without the "-": -p -> p
      const value = args[i + 1];

      if (value && !value.startsWith("-")) {
        result[key!] = value;
        i++; // Skip the next index as it is already being used.
      }
    }
  }

  return result;
};
