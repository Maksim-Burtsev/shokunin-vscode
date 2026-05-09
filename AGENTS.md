# AGENTS.md

## Release Notes For Agents

- This is a VS Code theme extension published as `maksim-burtsev.shokunin-light`.
- Keep release changes scoped to `package.json`, `package-lock.json`, `CHANGELOG.md`, and the relevant theme/docs files.
- Package with `npm run package`.
- Publish the generated VSIX to Marketplace with `vsce`.

## Marketplace Token

- The local publish token is stored outside git in `.env.local` at the repository root.
- `.env.local` must contain `VSCE_PAT=...`.
- `.env.local` is ignored by git and should never be printed, copied into commits, or included in PR text.
- Before publishing, load it in the current shell:

```sh
set -a
source .env.local
set +a
```

- Publish an already packaged release with:

```sh
npx vsce publish -i shokunin-light-<version>.vsix
```

## Release Checklist

1. Bump the extension version in `package.json` and `package-lock.json`.
2. Add a `CHANGELOG.md` entry for the new version.
3. Run `npm run package`.
4. Open and merge a PR into `master`.
5. Tag the merge commit as `v<version>`.
6. Create a GitHub Release and upload the VSIX.
7. Source `.env.local` and publish the same VSIX to Marketplace.
8. Verify Marketplace with `npx vsce show maksim-burtsev.shokunin-light`.
