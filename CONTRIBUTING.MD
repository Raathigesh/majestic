### Preparing Majestic

- Clone this repository
- Install dependencies with `yarn install`

### Running Majestic

Majestic has 2 main components as follows

- The UI written in React JS and GraphQL
  - The UI source is in `./ui` - Running `yarn ui` will start the webpack dev server
- A Node JS GraphQL server
  - The server source is in `./server` - Running `yarn watch-server` will start the server in watch mode

## Running integration test

We have a couple of integration tests written using [Cypress](https://www.cypress.io/) available in the `./integration` folder.

To run the integration test

- Do a production build by running `yarn prod`
- `cd ./integration`
- Run `yarn prepare` to install required packages
- Run `Yarn run-integration` to run the integration tests

### Building Production Bundle

The UI is built by Webpack and the server is also built by Webpack to decrease install times.

Run `yarn prod` to build a production bundle and the artifacts would be available in `dist` folder.

### Publishing a new release

Running `yarn ship` will perform a production build and will publish a new version to npm.
