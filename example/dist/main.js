// altv-client-worker:C:\altv-dev\projects\altv-esbuild-client-worker\example\src\example.worker
import { Worker } from "alt-client";
var example_default = new Worker("./example.worker.js");

// src/main.js
example_default.start();
example_default.emit("test");
