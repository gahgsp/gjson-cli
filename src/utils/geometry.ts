import {
  isMultiPolygonFeature,
  isPointFeature,
  isPolygonFeature,
} from "../guards/geojson";
import type { BoundingBox, Feature, Position } from "../types";

/**
 * Constains a very small value to avoid division by 0 in specific cases.
 */
const SAFETY_PADDING = 0.0001;

/**
 * Extract multiple Outer Rings from different Features inside a GeoJSON file.
 * @param features A list of features containing Geometries to have their Outer Rings extracted.
 * @returns A list containing all the Outer Rings.
 */
export const extractAllOuterRings = (features: Feature[]): Position[][] => {
  const rings: Position[][] = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (isPolygonFeature(feature)) {
      rings.push(feature.geometry.coordinates[0]);
    } else if (isMultiPolygonFeature(feature)) {
      for (let j = 0; i < feature.geometry.coordinates.length; i++) {
        rings.push(feature.geometry.coordinates[j][0]); // We add the Outer Ring from each Polygon.
      }
    } else if (isPointFeature(feature)) {
      rings.push([feature.geometry.coordinates]);
    }
  }

  return rings;
};

/**
 * Creates a "global" Bounding Box.
 * By "global", it is meant to consider all the valid shapes (Outer Rings) that will be drawn in the canvas.
 * @param rings The rings to be drawn. This list should contain all the rings expected to the be drawn in the canvas in this single execution.
 * @returns A "global" Bounding Box, taking into consideration all the rings passed as parameter.
 */
export const createGlobalBoundingBox = (rings: Position[][]): BoundingBox => {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    for (let j = 0; j < ring.length; j++) {
      const [lng, lat] = ring[j];
      minX = Math.min(minX, lng);
      maxX = Math.max(maxX, lng);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    }
  }

  // In some cases, such as a GeoJSON with a single Point Feature,
  // we want to avoid having a bbox with the same coordinates as the Point itself.
  // To avoid breaking the tool when calculating coordinates -> Terminal position,
  // we apply this safety padding.
  return {
    minX: minX === maxX ? minX - SAFETY_PADDING : minX,
    maxX: minX === maxX ? maxX + SAFETY_PADDING : maxX,
    minY: minY === maxY ? minY - SAFETY_PADDING : minY,
    maxY: minY === maxY ? maxY + SAFETY_PADDING : maxY,
  };
};
