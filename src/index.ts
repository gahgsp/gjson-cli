import { MultiPolygonRenderer } from "./renderer/MultiPolygonRenderer";
import { PolygonRenderer } from "./renderer/PolygonRenderer";
import type { Feature, GeoJSON, MultiPolygon, Polygon } from "./types";

// The first 2 arguments are useless for us: Bun and CLI paths.
const filePath = Bun.argv[2];

if (!filePath) {
  console.error("Required parameter is missing.");
  process.exit(1);
}

const file = Bun.file(filePath);

const contents: GeoJSON = await file.json();

// TODO: Type guards.
// TODO: Only first feature?
if (
  contents.features.length === 1 &&
  contents.features[0]?.geometry.type === "Polygon"
) {
  const renderer = new PolygonRenderer();
  renderer.renderPolygon(contents.features[0] as Feature<Polygon>);
} else if (
  contents.features.length === 1 &&
  contents.features[0]?.geometry.type === "MultiPolygon"
) {
  const renderer = new MultiPolygonRenderer();
  renderer.renderMultiPolygon(contents.features[0] as Feature<MultiPolygon>);
}
