export type Position = [number, number] | [number, number, number];

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: Position[];
  bbox?: [number, number, number, number];
}

export interface Vertex {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
