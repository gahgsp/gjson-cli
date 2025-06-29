import type { Feature, Polygon } from "../types";
import { Renderer } from "./Renderer";

class PolygonRenderer extends Renderer {
  /**
   * Extract the coordinates of the Outer Ring as we only will draw the shape of the Polygon.
   * @param polygon The Polygon to be drawn.
   * @returns The outer ring of the polygon.
   */
  private extractOuterRingCoordinates(polygon: Feature<Polygon>) {
    return polygon.geometry.coordinates[0];
  }

  public renderPolygon(polygon: Feature<Polygon>): void {
    const coordinates = this.extractOuterRingCoordinates(polygon);

    const terminalVertices = coordinates.map(([lng, lat]) =>
      this.mapToTerminal(lng, lat)
    );

    this.drawShape(terminalVertices);
  }
}

export { PolygonRenderer };
