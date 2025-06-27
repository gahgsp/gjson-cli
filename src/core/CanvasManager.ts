import { ESCAPE } from "../types";
import { fromColorToAnsi } from "../utils/paint";

class CanvasManager {
  private static instance: CanvasManager;
  // @ts-ignore Canvas is initialized in the constructor.
  private canvas: string[][];

  private constructor() {
    let terminalWidth = process.stdout.columns || 80;
    let terminalHeight = process.stdout.rows || 24;

    // Add some padding to the canvas.
    terminalWidth -= 2;
    terminalHeight -= 4;

    this.initCanvas(terminalWidth, terminalHeight);
  }

  /**
   * Initializes an empty canvas ready for drawing.
   */
  private initCanvas(width: number, height: number): void {
    this.canvas = [];
    for (let y = 0; y < height; y++) {
      this.canvas[y] = new Array(width).fill(" ");
    }
  }

  public static getInstance(): CanvasManager {
    if (!CanvasManager.instance) {
      CanvasManager.instance = new CanvasManager();
    }
    return CanvasManager.instance;
  }

  public getSize(): { height: number; width: number } {
    return { height: this.canvas.length, width: this.canvas[0]?.length ?? 0 };
  }

  public drawOnCanvas({
    x,
    y,
    color,
  }: {
    x: number;
    y: number;
    color?: string;
  }): void {
    // TODO: Maybe the Renderer decides what and in which color to draw?
    // TODO: This would allow for further customization on drawing capabilities.
    this.canvas[y][x] = color ? `${fromColorToAnsi(color)}#${ESCAPE}` : "#";
  }

  public display(): void {
    // Before drawing a new AOI, we clear the Terminal / Console.
    console.clear();

    const canvasWidth = this.canvas[0]?.length ?? 0;

    console.log("┌" + "─".repeat(canvasWidth) + "┐");

    this.canvas.forEach((row) => {
      console.log("│" + row.join("") + "│");
    });

    console.log("└" + "─".repeat(canvasWidth) + "┘");
  }
}

export { CanvasManager };
