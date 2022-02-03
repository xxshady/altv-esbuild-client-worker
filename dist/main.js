// src/main.ts
import * as esbuild from "esbuild";
import path from "path";
var pluginName = "altv-client-worker";
var consoleBlueColor = "\x1B[34m";
var consoleResetColor = "\x1B[0m";
var nodeModulesFolder = "node_modules";
var log = (...args) => {
  console.log(`${consoleBlueColor}[${pluginName}]${consoleResetColor}`, ...args);
};
var buildWorker = async (workerPath, outdir, extraWorkerEsbuildOptions) => {
  const startNodeModulesIdx = workerPath.indexOf(nodeModulesFolder);
  let workerFileName = workerPath.slice(workerPath.lastIndexOf("\\") + 1);
  workerFileName = workerFileName.slice(0, workerFileName.lastIndexOf(".")) + ".js";
  if (startNodeModulesIdx !== -1) {
    const endNodeModulesIdx = startNodeModulesIdx + nodeModulesFolder.length + 1;
    const lastSlashIdx = workerPath.indexOf("\\", endNodeModulesIdx);
    const packageName = workerPath.slice(endNodeModulesIdx, lastSlashIdx);
    const prefix = `${packageName}__`;
    log(`build worker "${workerFileName}" from node module "${packageName}"`);
    workerFileName = `${prefix}${workerFileName}`;
  }
  const outfile = `${outdir}/${workerFileName}`;
  log("build worker into:", outfile);
  await esbuild.build({
    entryPoints: [workerPath],
    bundle: true,
    outfile,
    target: "esnext",
    format: "esm",
    external: ["alt-worker"],
    ...extraWorkerEsbuildOptions
  });
  return workerFileName;
};
var altvClientWorker = ({ extraWorkerEsbuildOptions } = {}) => {
  return {
    name: pluginName,
    setup(build2) {
      const { initialOptions: { outdir } } = build2;
      if (!outdir) {
        throw new Error(`[${pluginName}] esbuild config must include outdir`);
      }
      build2.onResolve({ filter: /^worker!|\.worker\.(js|ts)$/ }, ({ path: workerPath, resolveDir }) => {
        const realPath = workerPath.replace(/^worker!/, "");
        const fullPath = path.resolve(resolveDir, realPath);
        return {
          path: fullPath,
          namespace: pluginName
        };
      });
      build2.onLoad({ filter: /.*/, namespace: pluginName }, async ({ path: workerPath }) => {
        log("workerPath:", workerPath);
        if (!/\.js$/.test(workerPath)) {
          workerPath += ".js";
        }
        const workerFileName = await buildWorker(workerPath, outdir, extraWorkerEsbuildOptions);
        return {
          contents: `
            import { Worker } from 'alt-client';
            export default new Worker('./${workerFileName}');
          `
        };
      });
    }
  };
};
export {
  altvClientWorker
};
