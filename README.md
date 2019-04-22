<div  align="center">
<img src="./image.png" />
<br />
<br />
<img src="https://img.shields.io/travis/Raathigesh/majestic.svg?style=flat-square" />
<img src="https://img.shields.io/github/license/Raathigesh/majestic.svg?style=flat-square" />
<img src="https://img.shields.io/npm/v/majestic.svg?style=flat-square" />
<img src="https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square" />
<a href="https://spectrum.chat/majestic">
  <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>
</div>

<br />

Majestic is a GUI for [Jest](https://jestjs.io/)

- ✅ Run all the tests or a single file
- ⏱ Toggle watch mode
- 📸 Update snapshots
- ❌ Examine test failures as they happen
- ⏲ Console.log() to the UI for debugging
- 🔍 Search tests
- 💎 Works with flow and typescript projects
- 📦 Works with Create react app

> Majestic supports Jest 20 and above

### Get started

Run majestic via `npx` in a project directory

```bash
cd ./my-jest-project # go into a project with Jest
npx majestic # execute majestic
```

or install Majestic globally via Yarn and run majestic

```bash
yarn global add majestic # install majestic globally
cd ./my-jest-project # go into a project with Jest
majestic # execute majestic
```

or install Majestic globally via Npm and run majestic

```bash
npm install majestic -g # install majestic globally
cd ./my-jest-project # go into a project with Jest
majestic # execute majestic
```

### Running as an app

Running with the `--app` flag will launch Majestic as a chrome app.

### Optional configuration

You can configure Majestic by adding `majestic` key to `package.json`.

```javascript
// package.json
{
    "majestic": {
        // if majestic fails to find the Jest package, you can provide it here. Should be relative to the package.json
        jestScriptPath: "../node_modules/jest/bin/jest.js",
        // if you want to pass additional arguments to jest, do it here
        args: [],
        // environment variables to pass to the process
        env: {}
    }
}
```

### Arguments

`--port` - Will use this port if available, else Majestic will pick another free port.

`--debug` - Will output extra debug info to console. Helps with debugging.

`--noOpen` - Will prevent from automatically opening the UI url in the browser

`--version` - Will print the version of Majestic and will exit

### Contribute

Have a look at the [contribution guide](./CONTRIBUTING.MD).

### License

MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://www.duncanbeevers.com"><img src="https://avatars0.githubusercontent.com/u/7367?v=4" width="100px;" alt="Duncan Beevers"/><br /><sub><b>Duncan Beevers</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=duncanbeevers" title="Code">💻</a></td><td align="center"><a href="https://github.com/M4cs"><img src="https://avatars3.githubusercontent.com/u/34947910?v=4" width="100px;" alt="Max Bridgland"/><br /><sub><b>Max Bridgland</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=M4cs" title="Documentation">📖</a> <a href="https://github.com/Raathigesh/majestic/commits?author=M4cs" title="Code">💻</a> <a href="#ideas-M4cs" title="Ideas, Planning, & Feedback">🤔</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
