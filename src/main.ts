import * as esbuild from "esbuild"
import path from "path"
import type { IAltvClientWorkerOptions } from "./types"

const pluginName = "altv-client-worker"
const consoleBlueColor = "\x1b[34m"
const consoleResetColor = "\x1b[0m"
const nodeModulesFolder = "node_modules"

const log = (...args: unknown[]) => {
  console.log(`${consoleBlueColor}[${pluginName}]${consoleResetColor}`, ...args)
}

const buildWorker = async (
  workerPath: string,
  outdir: string,
  extraWorkerEsbuildOptions?: esbuild.BuildOptions,
): Promise<string> => {
  const startNodeModulesIdx = workerPath.indexOf(nodeModulesFolder)

  let workerFileName = workerPath.slice(workerPath.lastIndexOf("\\") + 1)
  workerFileName = workerFileName.slice(0, workerFileName.lastIndexOf(".")) + ".js"

  if (startNodeModulesIdx !== -1) {
    const endNodeModulesIdx = startNodeModulesIdx + nodeModulesFolder.length + 1
    const lastSlashIdx = workerPath.indexOf("\\", endNodeModulesIdx)
    const packageName = workerPath.slice(
      endNodeModulesIdx,
      lastSlashIdx,
    )
    const prefix = `${packageName}__`

    log(`build worker "${workerFileName}" from node module "${packageName}"`)

    workerFileName = `${prefix}${workerFileName}`
  }

  const outfile = `${outdir}/${workerFileName}`

  log("build worker into:", outfile)

  await esbuild.build({
    entryPoints: [workerPath],
    bundle: true,
    outfile,
    target: "esnext",
    format: "esm",
    external: ["alt-worker"],
    ...extraWorkerEsbuildOptions,
  })

  return workerFileName
}

export const altvClientWorker = ({ extraWorkerEsbuildOptions }: IAltvClientWorkerOptions = {}): esbuild.Plugin => {
  return {
    name: pluginName,

    setup(build) {
      const { initialOptions: { outdir } } = build

      if (!outdir) {
        throw new Error(`[${pluginName}] esbuild config must include outdir`)
      }

      build.onResolve({ filter: /^worker!|\.worker\.(js|ts)$/ }, ({ path: workerPath, resolveDir }) => {
        const realPath = workerPath.replace(/^worker!/, "")
        const fullPath = path.resolve(resolveDir, realPath)

        return {
          path: fullPath,
          namespace: pluginName,
        }
      })

      build.onLoad({ filter: /.*/, namespace: pluginName }, async ({ path: workerPath }) => {
        log("workerPath:", workerPath)

        if (!(/\.js$/.test(workerPath))) {
          workerPath += ".js"
        }

        const workerFileName = await buildWorker(workerPath, outdir, extraWorkerEsbuildOptions)

        return {
          contents: (`
            import { Worker } from 'alt-client';
            export default new Worker('./${workerFileName}');
          `),
        }
      })
    },
  }
}