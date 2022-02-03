import * as alt from "alt-worker"

alt.on("test", (...args) => {
  alt.log("[worker]", "test event data:", JSON.stringify(args))
})