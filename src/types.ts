import type * as esbuild from "esbuild"

export interface IAltvClientWorkerOptions {
  extraWorkerEsbuildOptions?: esbuild.BuildOptions
}