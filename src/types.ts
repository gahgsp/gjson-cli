export type Position = [number, number] | [number, number, number];

export type LinearRing = Position[];

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: LinearRing[];
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
