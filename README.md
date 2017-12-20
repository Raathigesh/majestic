<h1 align="center">
  <img src="./docs/logo.png" alt="logo" width="300px" height="70px" />
  <h3 align="center">A UI for Jest</h3>
  <h4> 🛣 This is still work in progress 🛣 </h4>
</h1>

## What is Majestic?

Majestic is an electron app which tries to put a UI for Jest.

## Features

* Run particular tests with a click
* Update specific snapshots with a click
* Inline coverage reports
* Zero configuration (Sorry, I had to)
* Supports Create-react-app out of the box

### Exteral jest configuration file

Majestic is a zero config tool if you keep all your jest configuration in the `package.json` file.

If you have an external `jest` config file, you should have a `jestConfig` key in the `package.json` pointing to the file as shown below.

```json
{
  "name": "my-awesome-proj",
  "version": "0.1.0",
  "description": "..",
  "jestConfig": "./jest-custom.config.js"
}
```

## Contribute

Majestic relies on [`jest-editor-support`](https://github.com/facebook/jest/tree/master/packages/jest-editor-support), a module from jest, which allows to execute jest programatically.

```
git clone https://github.com/facebook/jest.git
cd jest
yarn install

# link jest-editor-support
cd packages/jest-editor-support
yarn link
```

Now let's setup majestic.

```
git clone https://github.com/Raathigesh/majestic.git
cd majestic

# this would install and would do a yarn link for jest-editor-support
yarn install

# start the app
yarn dev
```

## Inspiration

This tool is partially inspired by https://wallabyjs.com/. Check them out.

## Thanks

Thank you [@orta](https://github.com/orta) for building [VSCode Jest](https://github.com/jest-community/vscode-jest) and doing the heavy lifting.

## License

MIT © [Raathigeshan](https://twitter.com/Raathigesh)
