import * as esbuild from "esbuild"

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  target: 'esnext',
  format: 'esm',
  external: ['esbuild']
})