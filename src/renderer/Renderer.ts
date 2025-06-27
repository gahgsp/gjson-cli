import { CanvasManager } from "../core/CanvasManager";
import { type BoundingBox, type Vertex } from "../types";

abstract class Renderer {
  private color: string;
  private bbox: BoundingBox;

  constructor({ bbox, color }: { bbox: BoundingBox; color?: string }) {
    this.bbox = bbox;
    this.color = color || "";
  }

  /**
   * Converts the Longitude and Latitude to Terminal coordinates.
   * @param lng The longitude.
   * @param lat The latitude.
   * @param bbox A BBOX containing the coordinates of the maximum and minimum longitude and latitude.
   * @returns The position of the Vertex based on the Terminal coordinates.
   */
  protected mapToTerminal(lng: number, lat: number): Vertex {
    const canvas = CanvasManager.getInstance();
    const { width, height } = canvas.getSize();
    const x = Math.round(
      ((lng - this.bbox.minX) / (this.bbox.maxX - this.bbox.minX)) * (width - 1)
    );

    const y = Math.round(
      ((this.bbox.maxY - lat) / (this.bbox.maxY - this.bbox.minY)) *
        (height - 1)
    );

    return { x, y };
  }

  /**
   * Draws a line between two Points using the Bresenham's line algorithm (https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm).
   * @param from The starting Point where the line will begin being drawn.
   * @param to The ending Point where the line will finish being drawn.
   */
  protected drawLine(from: Vertex, to: Vertex): void {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const sx = from.x < to.x ? 1 : -1;
    const sy = from.y < to.y ? 1 : -1;
    let err = dx - dy;

    let x = from.x;
    let y = from.y;

    while (true) {
      if (this.isVertexInsideTerminalBounds({ x, y })) {
        CanvasManager.getInstance().drawOnCanvas({ x, y, color: this.color });
      }

      // Starting from the "from" Vertex, we reached the "to" Vertex.
      // The vertices are connected, so we can stop the loop.
      if (x === to.x && y === to.y) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  private isVertexInsideTerminalBounds = ({ x, y }: Vertex): boolean => {
    const canvas = CanvasManager.getInstance();
    const { width, height } = canvas.getSize();
    return x >= 0 && x < width && y >= 0 && y < height;
  };

  /**
   * Draws a shape by connecting all vertices in sequence.
   * @param vertices Array of vertices to connect.
   */
  protected drawShape(vertices: Vertex[]): void {
    // Connects two consecutive vertices.
    for (let i = 0; i < vertices.length - 1; i++) {
      this.drawLine(vertices[i], vertices[i + 1]);
    }

    // This needs to be done outside the main drawing loop.
    // Here we connect the last vertex to the first vertex in order to "close" the Shape.
    this.drawLine(vertices[vertices.length - 1], vertices[0]);
  }
}

export { Renderer };
