import type { SupportedArgs } from "../types";

export const parseArgs = (args: string[]): SupportedArgs => {
  const result: SupportedArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      // Supported path arguments: "-p" and "--path".
      case "-p":
      case "--path":
        result.path = args[i + 1];
        i++;
        break;
      // Supported color arguments: "-c" and "--color".
      case "-c":
      case "--color":
        result.color = args[i + 1];
        i++;
        break;
      // Supported help arguments: "-h" and "--help".
      case "-h":
      case "--help":
        result.help = true;
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

export const displayHelp = () => {
  console.log(
    `
    GJSON - GeoJSON rendered in your Terminal / Console.

    Usage:
      bun render [options]

    Description:
      A lightweight CLI tool that renders GeoJSON shapes from Geometries directly in your Terminal using ASCII art.

    Options:
      -p, --path <file>       Path to your GeoJSON file.
      -c, --color <color>     Color name (e.g green) or hexcode (e.g #ff0000) for rendering.
      -h, --help              Shows this help message and exit.

    Examples:
      bun render -p ./polygon.geojson
      bun render --path ./map.geojson --color green
      bun render -p data.geojson -c #ffcc00

    Note:
      This is a work-in-progress.
      Currently, only the first Feature in a GeoJSON file will be rendered.
      Supported geometries: Polygon and MultiPolygon.
    `
  );
};
