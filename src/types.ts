// [Longitude, Latitude, Altitude (optional)]
export type Position = [number, number] | [number, number, number];

interface BaseGeometry {
  type: string;
  coordinates: any;
}

export interface Polygon extends BaseGeometry {
  type: "Polygon";
  coordinates: Position[][];
}

export type Geometry = Polygon;

export interface Feature<G = Geometry, P = { [key: string]: any }> {
  type: "Feature";
  geometry: G;
  properties: P | null;
  id?: string | number;
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
