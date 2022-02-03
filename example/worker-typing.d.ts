declare module "*.worker.ts" {
  import { Worker } from "alt-client"
  
  const worker: Worker
  export default worker
}

declare module "worker!*" {
  import { Worker } from "alt-client"
  
  const worker: Worker
  export default worker
}