const baseUrl = document.baseURI || location.href
const validatorWorker = new Worker(new URL("./validator.worker.js", baseUrl))

export { validatorWorker }
