import type { BoundingBox, Feature, Polygon, Position, Vertex } from "../types";

class PolygonRenderer {
  private terminalWidth: number;
  private terminalHeight: number;
  // @ts-ignore Canvas is initialized in the constructor.
  private canvas: string[][];

  constructor() {
    this.terminalWidth = process.stdout.columns || 80;
    this.terminalHeight = process.stdout.rows || 24;

    // Add some padding to the canvas.
    this.terminalWidth -= 2;
    this.terminalHeight -= 4;

    this.initCanvas();
  }

  private initCanvas(): void {
    this.canvas = [];
    for (let y = 0; y < this.terminalHeight; y++) {
      this.canvas[y] = new Array(this.terminalWidth).fill(" ");
    }
  }

  /**
   * Extract the coordinates of the Outer Ring as we only will draw the shape of the Polygon.
   * @param polygon The Polygon to be drawn.
   * @returns The outer ring of the polygon.
   */
  private extractOuterRingCoordinates(polygon: Feature<Polygon>) {
    return polygon.geometry.coordinates[0]!;
  }

  /**
   * Creates a bounding box based on the Polygon received.
   * For this bounding box, the vertices are the maximum and minimum longitude and latitude.
   * @param orCoordinates The outer ring coordinates of the Polygon.
   * @returns a BBOX with the extremes from the Polygon.
   */
  private getBoundingBox(orCoordinates: Position[]): BoundingBox {
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    orCoordinates.forEach(([lng, lat]) => {
      minX = Math.min(minX, lng);
      maxX = Math.max(maxX, lng);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    });

    return { minX, maxX, minY, maxY };
  }

  /**
   * Converts the Longitude and Latitude to Terminal coordinates.
   * @param lng The longitude.
   * @param lat The latitude.
   * @param bbox A BBOX containing the coordinates of the maximum and minimum longitude and latitude.
   * @returns The position of the Vertex based on the Terminal coordinates.
   */
  private mapToTerminal(lng: number, lat: number, bbox: BoundingBox): Vertex {
    const x = Math.round(
      ((lng - bbox.minX) / (bbox.maxX - bbox.minX)) * (this.terminalWidth - 1)
    );

    const y = Math.round(
      ((bbox.maxY - lat) / (bbox.maxY - bbox.minY)) * (this.terminalHeight - 1)
    );

    return { x, y };
  }

  /**
   * Draws a line between two Points using the Bresenham's line algorithm (https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm).
   * @param from The starting Point where the line will begin being drawn.
   * @param to The ending Point where the line will finish being drawn.
   */
  private drawLine(from: Vertex, to: Vertex): void {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const sx = from.x < to.x ? 1 : -1;
    const sy = from.y < to.y ? 1 : -1;
    let err = dx - dy;

    let x = from.x;
    let y = from.y;

    while (true) {
      if (this.isVertexInsideTerminalBounds({ x, y })) {
        // @ts-ignore I promise to you TS, this property is initialized in the constructor.
        this.canvas[y][x] = "#";
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
    return (
      x >= 0 && x < this.terminalWidth && y >= 0 && y < this.terminalHeight
    );
  };

  private display(): void {
    // Before drawing a new AOI, we clear the Terminal / Console.
    console.clear();

    console.log("┌" + "─".repeat(this.terminalWidth) + "┐");

    this.canvas.forEach((row) => {
      console.log("│" + row.join("") + "│");
    });

    console.log("└" + "─".repeat(this.terminalWidth) + "┘");
  }

  public renderPolygon(polygon: Feature<Polygon>): void {
    const coordinates = this.extractOuterRingCoordinates(polygon);

    const bbox = this.getBoundingBox(coordinates);

    const terminalVertices = coordinates.map(([lng, lat]) =>
      this.mapToTerminal(lng, lat, bbox)
    );

    // Connects two consecutive vertices.
    for (let i = 0; i < terminalVertices.length - 1; i++) {
      this.drawLine(terminalVertices[i]!, terminalVertices[i + 1]!);
    }

    // This needs to be done outside the main drawing loop.
    // Here we connect the last vertex to the first vertex in order to "close" the Polygon.
    this.drawLine(
      terminalVertices[terminalVertices.length - 1]!,
      terminalVertices[0]!
    );

    this.display();
  }
}

export { PolygonRenderer };
