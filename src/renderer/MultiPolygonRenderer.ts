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

    multiPolygon.geometry.coordinates.forEach((polygon: Position[][]) => {
      coordinates.push(polygon[0]!);
    });

    return coordinates;
  }

  public renderMultiPolygon(multiPolygon: Feature<MultiPolygon>) {
    const coordinates = this.extractOuterRingsCoordinates(multiPolygon);

    const bbox = this.getBoundingBox(coordinates.flat());

    coordinates.forEach((coordinate) => {
      const terminalVertices = coordinate.map(([lng, lat]) =>
        this.mapToTerminal(lng, lat, bbox)
      );

      this.drawShape(terminalVertices);
    });

    this.display();
  }
}

export { MultiPolygonRenderer };
