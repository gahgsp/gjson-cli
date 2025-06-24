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

export interface MultiPolygon extends BaseGeometry {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

// TODO: Support "Point" and "MultiPolygon".
export type Geometry = Polygon | MultiPolygon;

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

export interface GeoJSON {
  type: "FeatureCollection";
  features: Feature[];
}

export const COLORS: Record<string, [r: number, g: number, b: number]> = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  magenta: [255, 0, 255],
};

export const ESCAPE = "\x1b[0m";

export interface SupportedArgs {
  path?: string;
  color?: string;
  help?: boolean;
}
