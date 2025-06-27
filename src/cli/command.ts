import { CanvasManager } from "../CanvasManager";
import { isMultiPolygonFeature, isPolygonFeature } from "../guards/geojson";
import { MultiPolygonRenderer } from "../renderer/MultiPolygonRenderer";
import { PolygonRenderer } from "../renderer/PolygonRenderer";
import type { Feature, GeoJSON, MultiPolygon, Polygon } from "../types";
import { displayHelp, parseArgs } from "../utils/args";
import {
  createGlobalBoundingBox,
  extractAllOuterRings,
} from "../utils/geometry";

export const run = async () => {
  // The first 2 arguments are useless for us: Bun and CLI paths.
  const args = parseArgs(Bun.argv.slice(2));

  if (args.help) {
    displayHelp();
    return;
  }

  // Checks for the existence of the "path" argument.
  if (!args.path) {
    console.error("Required parameter is missing.");
    process.exit(1);
  }

  // Extracts the "color" argument from the main command.
  const color = args.color || "";

  const file = Bun.file(args.path);

  const geoJson: GeoJSON = await file.json();

  /**
   * Pre-processing of the information required to configure the canvas.
   */
  const outerRings = extractAllOuterRings(geoJson.features);
  const bbox = createGlobalBoundingBox(outerRings);

  const polygonRenderer = new PolygonRenderer({ bbox, color });
  const multiPolygonRenderer = new MultiPolygonRenderer({ bbox, color });

  for (let i = 0; i < geoJson.features.length; i++) {
    const currentFeature = geoJson.features[i];
    if (isPolygonFeature(currentFeature)) {
      polygonRenderer.renderPolygon(currentFeature);
    } else if (isMultiPolygonFeature(currentFeature)) {
      multiPolygonRenderer.renderMultiPolygon(currentFeature);
    }
  }

  CanvasManager.getInstance().display();
};
