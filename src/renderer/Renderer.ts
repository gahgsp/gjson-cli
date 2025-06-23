import { type BoundingBox, type Vertex, type Position, ESCAPE } from "../types";
import { fromColorToAnsi } from "../utils/paint";

abstract class Renderer {
  protected terminalWidth: number;
  protected terminalHeight: number;
  // @ts-ignore Canvas is initialized in the constructor.
  private canvas: string[][];
  private color: string;

  constructor({ color }: { color?: string }) {
    this.terminalWidth = process.stdout.columns || 80;
    this.terminalHeight = process.stdout.rows || 24;

    // Add some padding to the canvas.
    this.terminalWidth -= 2;
    this.terminalHeight -= 4;

    this.color = color || "";

    this.initCanvas();
  }

  /**
   * Initializes an empty canvas ready for drawing.
   */
  private initCanvas(): void {
    this.canvas = [];
    for (let y = 0; y < this.terminalHeight; y++) {
      this.canvas[y] = new Array(this.terminalWidth).fill(" ");
    }
  }

  /**
   * Creates a bounding box based on the Polygon received.
   * For this bounding box, the vertices are the maximum and minimum longitude and latitude.
   * @param orCoordinates The outer ring coordinates of the Polygon.
   * @returns a BBOX with the extremes from the Polygon.
   */
  protected getBoundingBox(orCoordinates: Position[]): BoundingBox {
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
  protected mapToTerminal(lng: number, lat: number, bbox: BoundingBox): Vertex {
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
        // @ts-ignore I promise to you TS, this property is initialized in the constructor.

        this.canvas[y][x] = `${fromColorToAnsi(this.color)}#${ESCAPE}`;
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

  /**
   * Draws a shape by connecting all vertices in sequence.
   * @param vertices Array of vertices to connect.
   */
  protected drawShape(vertices: Vertex[]): void {
    // Connects two consecutive vertices.
    for (let i = 0; i < vertices.length - 1; i++) {
      this.drawLine(vertices[i]!, vertices[i + 1]!);
    }

    // This needs to be done outside the main drawing loop.
    // Here we connect the last vertex to the first vertex in order to "close" the Shape.
    this.drawLine(vertices[vertices.length - 1]!, vertices[0]!);
  }

  protected display(): void {
    // Before drawing a new AOI, we clear the Terminal / Console.
    console.clear();

    console.log("┌" + "─".repeat(this.terminalWidth) + "┐");

    this.canvas.forEach((row) => {
      console.log("│" + row.join("") + "│");
    });

    console.log("└" + "─".repeat(this.terminalWidth) + "┘");
  }
}

export { Renderer };
