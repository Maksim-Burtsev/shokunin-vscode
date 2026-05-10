import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_THEME_PATH = fileURLToPath(
  new URL("../themes/shokunin-sumi-ume-color-theme.json", import.meta.url),
);
const DEFAULT_OUTPUT_DIR = fileURLToPath(new URL("../iterm", import.meta.url));

const COLOR_MAPPINGS = [
  ["Ansi 0 Color", "terminal.ansiBlack"],
  ["Ansi 1 Color", "terminal.ansiRed"],
  ["Ansi 2 Color", "terminal.ansiGreen"],
  ["Ansi 3 Color", "terminal.ansiYellow"],
  ["Ansi 4 Color", "terminal.ansiBlue"],
  ["Ansi 5 Color", "terminal.ansiMagenta"],
  ["Ansi 6 Color", "terminal.ansiCyan"],
  ["Ansi 7 Color", "terminal.ansiWhite"],
  ["Ansi 8 Color", "terminal.ansiBrightBlack"],
  ["Ansi 9 Color", "terminal.ansiBrightRed"],
  ["Ansi 10 Color", "terminal.ansiBrightGreen"],
  ["Ansi 11 Color", "terminal.ansiBrightYellow"],
  ["Ansi 12 Color", "terminal.ansiBrightBlue"],
  ["Ansi 13 Color", "terminal.ansiBrightMagenta"],
  ["Ansi 14 Color", "terminal.ansiBrightCyan"],
  ["Ansi 15 Color", "terminal.ansiBrightWhite"],
  ["Background Color", "terminal.background"],
  ["Bold Color", "terminal.foreground"],
  ["Cursor Color", "terminalCursor.foreground"],
  ["Cursor Text Color", "terminalCursor.background"],
  ["Foreground Color", "terminal.foreground"],
  ["Selected Text Color", "terminal.foreground"],
  ["Selection Color", "terminal.selectionBackground"],
];

function parseHexColor(hex, key) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex ?? "");

  if (!match) {
    throw new Error(`Expected ${key} to be a six-digit hex color, got ${hex}`);
  }

  const value = match[1];

  return {
    red: Number.parseInt(value.slice(0, 2), 16) / 255,
    green: Number.parseInt(value.slice(2, 4), 16) / 255,
    blue: Number.parseInt(value.slice(4, 6), 16) / 255,
  };
}

function colorToPlistEntry(itermKey, vscodeKey, hex) {
  const { red, green, blue } = parseHexColor(hex, vscodeKey);

  return [
    `\t<key>${itermKey}</key>`,
    "\t<dict>",
    "\t\t<key>Blue Component</key>",
    `\t\t<real>${blue}</real>`,
    "\t\t<key>Color Space</key>",
    "\t\t<string>sRGB</string>",
    "\t\t<key>Green Component</key>",
    `\t\t<real>${green}</real>`,
    "\t\t<key>Red Component</key>",
    `\t\t<real>${red}</real>`,
    "\t</dict>",
  ].join("\n");
}

export function buildItermColorsPlist(theme) {
  if (!theme?.colors) {
    throw new Error("Expected a VS Code theme object with a colors map");
  }

  const entries = COLOR_MAPPINGS.map(([itermKey, vscodeKey]) => {
    return colorToPlistEntry(itermKey, vscodeKey, theme.colors[vscodeKey]);
  });

  return `${[
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    "<dict>",
    entries.join("\n"),
    "</dict>",
    "</plist>",
  ].join("\n")}\n`;
}

export function generateItermColorsFile({
  themePath = DEFAULT_THEME_PATH,
  outputDir = DEFAULT_OUTPUT_DIR,
  presetName = "shokunin",
} = {}) {
  const theme = JSON.parse(readFileSync(themePath, "utf8"));
  const plist = buildItermColorsPlist(theme);
  const outputPath = join(outputDir, `${presetName}.itermcolors`);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, plist);

  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outputPath = generateItermColorsFile();
  console.log(outputPath);
}
