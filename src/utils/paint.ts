import { COLORS } from "../types";

export const fromColorToAnsi = (input: string): string => {
  let rgb: [number, number, number] | undefined;

  if (isHexColor(input)) {
    // We have a hex color.
    const hex = input.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgb = [r, g, b];
  } else if (COLORS[input.toLowerCase()]) {
    // We have the name of a color as a parameter.
    rgb = COLORS[input.toLowerCase()];
  }

  if (rgb) {
    const ansi8BitColor = fromHexTo8Bit(rgb);
    // "\x1b" = escape character;
    // "[38;5" = defines the [foreground] color to [8-bit];
    // "m" = end of the escape sequence.
    return `\x1b[38;5;${ansi8BitColor}m`; // 8-bit color.
  } else {
    return "\x1b[0m"; // Fallback to the "reset" escape code.
  }
};

const isHexColor = (input: string): boolean => {
  return input.startsWith("#") && input.length === 7;
};

/**
 * Converts an RGB color (24-bit) to the nearest ANSI 8-bit color code (0–255).
 *
 * The conversion maps each RGB component (0–255) to a 6-level color cube (0–5),
 * then calculates the corresponding ANSI color index (16–231) based on the 6×6×6 cube.
 *
 * @param rgb A tuple containing the red, green, and blue values (0–255 each).
 * @returns The ANSI 8-bit color code that best approximates the input color.
 *
 * @example
 * fromHexTo8Bit([255, 0, 255]); // => 201 (bright magenta)
 */
const fromHexTo8Bit = ([r, g, b]: [number, number, number]): number => {
  return (
    16 + // 0 - 15: system default colors; 16 - 231: colors we are interested in; 232 - 255: grayscale. Therefore, we start at 16.
    Math.floor((r * 6) / 256) * 36 + // Number of colors per red level (6 green × 6 blue = 36 colors).
    Math.floor((g * 6) / 256) * 6 + // Number of colors per green level (6 blue colors per green level).
    Math.floor((b * 6) / 256)
  );
};
