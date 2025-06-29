import type { Feature, MultiPolygon, Point, Polygon } from "../types";

export const isPolygonFeature = (val: any): val is Feature<Polygon> => {
  return val.geometry.type === "Polygon";
};

export const isMultiPolygonFeature = (
  val: any
): val is Feature<MultiPolygon> => {
  return val.geometry.type === "MultiPolygon";
};

export const isPointFeature = (val: any): val is Feature<Point> => {
  return val.geometry.type === "Point";
};
