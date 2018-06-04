**Configuring Majestic**

Majestic uses a bunch of sensible defaults to remain zero config so most of the projects can get started without much effort. But there could be certain use cases when your project is bit complicated than the usual once.

Majestic provides a couple of config options you can provide in your **package.json** file under the **majestic** key. A sample config would look like this.

```json
{
  "majestic": {
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
      "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}"
    ],
    "jestScript": "/node_modules/react-scripts/scripts/test.js",
    "args": ["--env=jsdom"],
    "env": {
      "CI": "true"
    }
  }
}
```

* testMatch - The test match pattern you are using in your project.
* jestScript - the jest script file that should be invoked to start jest.
* args - any arguments that should be provided to the jest process
* env - any environment variables that should be set before the process is spawn.
