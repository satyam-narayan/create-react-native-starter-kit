# Contributing

Thanks for helping improve `create-react-native-starter-kit`. Bug reports and pull requests are welcome on [GitHub](https://github.com/satyam-narayan/create-react-native-starter-kit/issues).

## Project layout

```text
bin/create-react-native-starter-kit.js   CLI entry (argument parsing, help)
lib/creator.js                           Orchestrates all steps
lib/deps.js                              Libraries installed into every new app (latest versions)
lib/copy-src.js                          Copies template files into the new app
lib/patch-configs.js                     babel, metro, tsconfig, env, App.tsx, scripts
lib/patch-native.js                      Android and iOS native changes
template/                                The starter app copied into every new project (src/, patches/, .env.example)
scripts/sync-template.js                 Refreshes template/ from the parent starter repo
test-patchers.js                         Tests for the patchers (npm test)
```

`template/` is committed to the repository, so this folder works and publishes on its own.

## Change the starter app

- **This folder as its own repository:** edit the files inside `template/` directly.
- **This folder inside the starter app repository:** change the app in the parent `src/`, then run `npm run sync-template` to copy `../src`, `../patches` and `../.env.example` into `template/`. This also runs automatically before `npm pack` / `npm publish`. When there is no parent app, the sync keeps `template/` as is.

Add or remove a library in `lib/deps.js` whenever the template starts or stops using it.

## Test locally

```bash
npm test                                    # patcher tests
npm link                                    # makes the command available on your machine
create-react-native-starter-kit MyApp --dry-run
create-react-native-starter-kit MyApp       # full run
npm unlink -g create-react-native-starter-kit
```

To test exactly what users will download: `npm pack`, then in another folder run `npx /path/to/create-react-native-starter-kit-<version>.tgz MyApp`.

## Publish to npm (maintainer only)

The first release is published as `1.0.0` with `npm login` and `npm publish`. For every release after that:

```bash
npm login
npm version patch       # bug fix: 1.0.0 → 1.0.1 (use minor / major for bigger changes)
npm publish
git push --follow-tags
```
