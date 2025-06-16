import { PolygonRenderer } from "./PolygonRenderer";

// The first 2 arguments are useless for us: Bun and CLI paths.
const filePath = Bun.argv[2];

if (!filePath) {
  console.error("Required parameter is missing.");
  process.exit(1);
}

const file = Bun.file(filePath);

const contents = await file.json();

const renderer = new PolygonRenderer();
renderer.renderPolygon(contents.features[0].geometry);
