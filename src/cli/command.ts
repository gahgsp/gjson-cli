import { isMultiPolygonFeature, isPolygonFeature } from "../guards/geojson";
import { MultiPolygonRenderer } from "../renderer/MultiPolygonRenderer";
import { PolygonRenderer } from "../renderer/PolygonRenderer";
import type { GeoJSON } from "../types";
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
  const color = args.color || "";

  const file = Bun.file(args.path);

  const geoJson: GeoJSON = await file.json();

  // TODO: Only first feature?
  if (isPolygonFeature(geoJson.features[0])) {
    const renderer = new PolygonRenderer({ color });
    renderer.renderPolygon(geoJson.features[0]);
  } else if (isMultiPolygonFeature(geoJson.features[0])) {
    const renderer = new MultiPolygonRenderer({ color });
    renderer.renderMultiPolygon(geoJson.features[0]);
  }
};
