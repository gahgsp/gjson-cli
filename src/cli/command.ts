import { MultiPolygonRenderer } from "../renderer/MultiPolygonRenderer";
import { PolygonRenderer } from "../renderer/PolygonRenderer";
import type { Feature, GeoJSON, MultiPolygon, Polygon } from "../types";
import { parseArgs } from "../utils/args";

export const run = async () => {
  // The first 2 arguments are useless for us: Bun and CLI paths.
  const args = parseArgs(Bun.argv.slice(2));

  // Checks for the existence of the "path" argument.
  if (!args.path) {
    console.error("Required parameter is missing.");
    process.exit(1);
  }

  // Extracts the "color" argument from the main command.
  const colorFromArguments = args.color || "";

  const file = Bun.file(args.path);

  const contents: GeoJSON = await file.json();

  // TODO: Type guards.
  // TODO: Only first feature?
  if (
    contents.features.length === 1 &&
    contents.features[0]?.geometry.type === "Polygon"
  ) {
    const renderer = new PolygonRenderer({ color: colorFromArguments });
    renderer.renderPolygon(contents.features[0] as Feature<Polygon>);
  } else if (
    contents.features.length === 1 &&
    contents.features[0]?.geometry.type === "MultiPolygon"
  ) {
    const renderer = new MultiPolygonRenderer({ color: colorFromArguments });
    renderer.renderMultiPolygon(contents.features[0] as Feature<MultiPolygon>);
  }
};
