import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import test from "node:test";

import {
  buildItermColorsPlist,
  generateItermColorsFile,
} from "./generate-itermcolors.mjs";

const theme = {
  colors: {
    "terminal.background": "#FCFAF2",
    "terminal.foreground": "#303841",
    "terminal.ansiBlack": "#303841",
    "terminal.ansiRed": "#C84053",
    "terminal.ansiGreen": "#157A5B",
    "terminal.ansiYellow": "#9A6000",
    "terminal.ansiBlue": "#006FAE",
    "terminal.ansiMagenta": "#8F4155",
    "terminal.ansiCyan": "#006C7F",
    "terminal.ansiWhite": "#F5F1E7",
    "terminal.ansiBrightBlack": "#777269",
    "terminal.ansiBrightRed": "#D95A66",
    "terminal.ansiBrightGreen": "#1B8E6A",
    "terminal.ansiBrightYellow": "#B67608",
    "terminal.ansiBrightBlue": "#0084C7",
    "terminal.ansiBrightMagenta": "#A75B73",
    "terminal.ansiBrightCyan": "#008396",
    "terminal.ansiBrightWhite": "#FFFFFF",
    "terminal.selectionBackground": "#D7EAF2",
    "terminalCursor.foreground": "#3A3E44",
    "terminalCursor.background": "#FCFAF2",
  },
};

const expectedKeys = [
  "Ansi 0 Color",
  "Ansi 1 Color",
  "Ansi 2 Color",
  "Ansi 3 Color",
  "Ansi 4 Color",
  "Ansi 5 Color",
  "Ansi 6 Color",
  "Ansi 7 Color",
  "Ansi 8 Color",
  "Ansi 9 Color",
  "Ansi 10 Color",
  "Ansi 11 Color",
  "Ansi 12 Color",
  "Ansi 13 Color",
  "Ansi 14 Color",
  "Ansi 15 Color",
  "Background Color",
  "Bold Color",
  "Cursor Color",
  "Cursor Text Color",
  "Foreground Color",
  "Selected Text Color",
  "Selection Color",
];

function plistColorKeys(plist) {
  return Array.from(
    plist.matchAll(/\t<key>([^<]+)<\/key>\n\t<dict>/g),
    ([, key]) => key,
  );
}

function colorComponents(plist, key) {
  const match = new RegExp(
    `<key>${key}</key>\\n\\t<dict>([\\s\\S]*?)\\n\\t</dict>`,
  ).exec(plist);

  if (!match) {
    throw new Error(`Missing ${key}`);
  }

  const components = Object.fromEntries(
    Array.from(
      match[1].matchAll(
        /\t\t<key>(Blue|Green|Red) Component<\/key>\n\t\t<real>([^<]+)<\/real>/g,
      ),
      ([, component, value]) => [component.toLowerCase(), Number(value)],
    ),
  );

  return components;
}

function colorSpace(plist, key) {
  const match = new RegExp(
    `<key>${key}</key>\\n\\t<dict>([\\s\\S]*?)\\n\\t</dict>`,
  ).exec(plist);

  if (!match) {
    throw new Error(`Missing ${key}`);
  }

  const colorSpaceMatch = /\t\t<key>Color Space<\/key>\n\t\t<string>([^<]+)<\/string>/.exec(
    match[1],
  );

  return colorSpaceMatch?.[1];
}

test("builds an iTerm2 color preset from VS Code terminal colors", () => {
  const plist = buildItermColorsPlist(theme);

  assert.deepEqual(plistColorKeys(plist).toSorted(), expectedKeys.toSorted());
  assert.deepEqual(colorComponents(plist, "Background Color"), {
    blue: 242 / 255,
    green: 250 / 255,
    red: 252 / 255,
  });
  assert.deepEqual(colorComponents(plist, "Ansi 4 Color"), {
    blue: 174 / 255,
    green: 111 / 255,
    red: 0,
  });
  assert.equal(colorComponents(plist, "Cursor Color").red, 58 / 255);
  assert.equal(colorComponents(plist, "Cursor Text Color").red, 252 / 255);
});

test("encodes every iTerm2 color as sRGB", () => {
  const plist = buildItermColorsPlist(theme);

  for (const key of expectedKeys) {
    assert.equal(colorSpace(plist, key), "sRGB");
  }
});

test("writes shokunin.itermcolors to the requested output directory", () => {
  const dir = mkdtempSync(join(tmpdir(), "shokunin-iterm-test-"));

  try {
    const themePath = join(dir, "theme.json");
    const outputDir = join(dir, "iterm");
    writeFileSync(themePath, `${JSON.stringify(theme, null, 2)}\n`);

    const outputPath = generateItermColorsFile({
      themePath,
      outputDir,
    });

    assert.equal(basename(outputPath), "shokunin.itermcolors");
    assert.match(readFileSync(outputPath, "utf8"), /<key>Selection Color<\/key>/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
