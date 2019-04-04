#### Custom react-scripts

If you're using a custom [react-scripts](https://www.npmjs.com/package/react-scripts) in your CRA app, set `jestScriptPath` to your script path. e.g.:

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
