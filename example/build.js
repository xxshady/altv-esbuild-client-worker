import { altvClientWorker } from "altv-esbuild-client-worker";
import { build } from "esbuild"

build({
  watch: true,
  bundle: true,
  format: 'esm',
  target: "esnext",
  logLevel: "info",
  entryPoints: ['src/main.js'],
  outdir: 'dist',
  external: [
    'alt-shared',
    'alt-client',
  ],
  plugins: [
    altvClientWorker(),
  ]
}).catch()