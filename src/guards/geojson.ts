import type { Feature, MultiPolygon, Polygon } from "../types";

export const isPolygonFeature = (val: any): val is Feature<Polygon> => {
  return val.geometry.type === "Polygon";
};

export const isMultiPolygonFeature = (
  val: any
): val is Feature<MultiPolygon> => {
  return val.geometry.type === "MultiPolygon";
};
