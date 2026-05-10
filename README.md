# Shokunin Light for VS Code

A rice-paper light theme for Python-focused craft: sumi classes, ume type hints, and asagi functions.

## Preview

### Python

![Python example](assets/preview.png)

### Go

![Go example](assets/preview-go.png)

### TypeScript

![TypeScript example](assets/preview-ts.png)

## VS Code Installation

### From Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for `Shokunin Light`
4. Click **Install**
5. `Ctrl+K Ctrl+T` / `Cmd+K Cmd+T` -> select **Shokunin**

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/Maksim-Burtsev/shokunin-theme/releases)
2. Run: `code --install-extension shokunin-light-*.vsix`

### From Source

```sh
git clone https://github.com/Maksim-Burtsev/shokunin-theme
cd shokunin-theme
npm install
npm run package
code --install-extension shokunin-light-*.vsix
```

## iTerm2 Installation

Shokunin also includes an iTerm2 color preset generated from the VS Code
integrated terminal colors.

1. Download `iterm/shokunin.itermcolors` from this repository or from a GitHub Release.
2. Open iTerm2.
3. Go to `Settings` / `Preferences` -> `Profiles` -> `Colors`.
4. Open `Color Presets...` -> `Import`.
5. Select `shokunin.itermcolors`.
6. Open `Color Presets...` again and choose **shokunin**.

## Palette

| Role | Color |
|---|---:|
| Paper / editor background | `#FCFAF2` |
| Main ink | `#303841` |
| Keywords / class names | `#3A3E44` |
| Functions / methods | `#006FAE` |
| Type hints | `#8F4155` |
| Strings | `#157A5B` |
| Constants / numbers | `#9A6000` |
| Comments | `#777269` |

## License

MIT
