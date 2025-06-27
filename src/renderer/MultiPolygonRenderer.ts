import type { Feature, MultiPolygon, Position } from "../types";
import { Renderer } from "./Renderer";

class MultiPolygonRenderer extends Renderer {
  /**
   * Extract the coordinates of the Outer Rings as we only will draw the shapes of the Polygons.
   * @param polygon The Polygon to be drawn.
   * @returns The outer ring of the polygon.
   */
  private extractOuterRingsCoordinates(multiPolygon: Feature<MultiPolygon>) {
    const coordinates: Position[][] = [];

    for (let i = 0; i < multiPolygon.geometry.coordinates.length; i++) {
      coordinates.push(multiPolygon.geometry.coordinates[i][0]);
    }

    return coordinates;
  }

  public renderMultiPolygon(multiPolygon: Feature<MultiPolygon>) {
    const coordinates = this.extractOuterRingsCoordinates(multiPolygon);

    for (let i = 0; coordinates.length; i++) {
      const coordinate = coordinates[i];
      const terminalVertices = coordinate.map(([lng, lat]) =>
        this.mapToTerminal(lng, lat)
      );
      this.drawShape(terminalVertices);
    }
  }
}

export { MultiPolygonRenderer };
