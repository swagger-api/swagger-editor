// use this for webpack@5 native loader`
// const metaUrl = import.meta.url // does not work as-is; reference path of THIS file
// const baseUrl = document.baseURI || location.href
// const validatorWorker = new Worker(new URL("./validator.worker.js", baseUrl))

// use this version for worker-loader
import Worker from "./validator.worker"
const validatorWorker = new Worker()

export { validatorWorker }
