import type { Feature, Point } from "../types";
import { Renderer } from "./Renderer";

class PointRenderer extends Renderer {
  private extractCoordinates(point: Feature<Point>) {
    return point.geometry.coordinates;
  }

  public renderPoint(point: Feature<Point>) {
    const [lng, lat] = this.extractCoordinates(point);

    const terminalVertex = this.mapToTerminal(lng, lat);

    this.drawShape([terminalVertex]);
  }
}

export { PointRenderer };
