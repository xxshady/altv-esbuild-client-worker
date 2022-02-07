# altv-esbuild-client-worker

A plugin that allows you to import [alt:V](https://altv.mp) clientside workers like regular JS/TS modules. See [example](/example/src/main.js)

## Installation

1. Install as npm package

`yarn add altv-esbuild-client-worker`

`npm i altv-esbuild-client-worker`

2. Add it into your esbuild config

```js
import { altvClientWorker } from "altv-esbuild-client-worker"

esbuild.build({
  plugins: [altvClientWorker()]
})
```
