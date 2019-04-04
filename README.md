<div  align="center">
<img src="./image.png" />
<br />
<br />
<img src="https://img.shields.io/travis/Raathigesh/majestic.svg?style=flat-square" />
<img src="https://img.shields.io/github/license/Raathigesh/majestic.svg?style=flat-square" />
<img src="https://img.shields.io/npm/v/majestic.svg?style=flat-square" />
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
        "jestScriptPath": "../node_modules/jest/bin/jest.js",
        // if you want to pass additional arguments to jest, do it here
        "args": [],
        // environment variables to pass to the process
        "env": {}
    }
}
```

### Arguments

`--port` - Will use this port if available, else Majestic will pick another free port.

`--debug` - Will output extra debug info to console. Helps with debugging.

`--noOpen` - Will prevent from automatically opening the UI url in the browser

`--version` - Will print the version of Majestic and will exit

### Troubleshooting

#### Custom react-scripts
If you're using a custom [react-scripts](https://www.npmjs.com/package/react-scripts) in your CRA app, set `jestScriptPath` to your script path.  e.g.:
```
  "jestScriptPath": "./node_modules/my-react-scripts/scripts/test.js"
```

#### Absolute import paths
Set `NODE_PATH` in the majestic env config: 
```
  "env": { 
    "NODE_PATH": "./src" 
  }
``` 

#### Mocked networks
When using [nock](https://github.com/nock/nock) (or other mock proxies) and get an error: 
  > (node:50245) UnhandledPromiseRejectionWarning: FetchError: request to http://localhost:4000/test-result failed, reason: Nock: Not allow net connect for "localhost:4000/test-result"
  
  make sure to re-enable net connection after the test completes, e.g. (in a setup file) :
  ```
  beforeAll(() => {
    nock.disableNetConnect();
  });
  
  afterAll(() => {
    nock.enableNetConnect();
  });
  ```
  



### Contribute

Have a look at the [contribution guide](./CONTRIBUTING.MD).

### License

MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://www.duncanbeevers.com"><img src="https://avatars0.githubusercontent.com/u/7367?v=4" width="100px;" alt="Duncan Beevers"/><br /><sub><b>Duncan Beevers</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=duncanbeevers" title="Code">💻</a></td><td align="center"><a href="https://github.com/M4cs"><img src="https://avatars3.githubusercontent.com/u/34947910?v=4" width="100px;" alt="Max Bridgland"/><br /><sub><b>Max Bridgland</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=M4cs" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/yurm04"><img src="https://avatars0.githubusercontent.com/u/4642404?v=4" width="100px;" alt="Yuraima Estevez"/><br /><sub><b>Yuraima Estevez</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=yurm04" title="Code">💻</a></td><td align="center"><a href="http://jake.nz"><img src="https://avatars2.githubusercontent.com/u/437471?v=4" width="100px;" alt="Jake Crosby"/><br /><sub><b>Jake Crosby</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=jake-nz" title="Code">💻</a></td><td align="center"><a href="http://gavinhenderson.me"><img src="https://avatars1.githubusercontent.com/u/1359202?v=4" width="100px;" alt="Gavin Henderson"/><br /><sub><b>Gavin Henderson</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=gavinhenderson" title="Code">💻</a></td><td align="center"><a href="https://briwa.github.io"><img src="https://avatars1.githubusercontent.com/u/8046636?v=4" width="100px;" alt="briwa"/><br /><sub><b>briwa</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=briwa" title="Code">💻</a></td><td align="center"><a href="https://github.com/Luanf"><img src="https://avatars0.githubusercontent.com/u/9099705?v=4" width="100px;" alt="Luan Ferreira"/><br /><sub><b>Luan Ferreira</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=Luanf" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://github.com/cse-tushar"><img src="https://avatars3.githubusercontent.com/u/12570521?v=4" width="100px;" alt="Tushar Gupta"/><br /><sub><b>Tushar Gupta</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=cse-tushar" title="Code">💻</a></td><td align="center"><a href="https://agu.st/"><img src="https://avatars3.githubusercontent.com/u/6601142?v=4" width="100px;" alt="Agusti Fernandez"/><br /><sub><b>Agusti Fernandez</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/commits?author=agustif" title="Code">💻</a> <a href="#ideas-agustif" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://blog.42at.com"><img src="https://avatars2.githubusercontent.com/u/233047?v=4" width="100px;" alt="Moos"/><br /><sub><b>Moos</b></sub></a><br /><a href="https://github.com/Raathigesh/majestic/issues?q=author%3Amoos" title="Bug reports">🐛</a> <a href="https://github.com/Raathigesh/majestic/commits?author=moos" title="Code">💻</a> <a href="https://github.com/Raathigesh/majestic/commits?author=moos" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
