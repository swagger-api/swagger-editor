// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = "/dist/"

import PromiseWorker from "promise-worker"
import debounce from "lodash/debounce"
import BareValidationWorker from "./validation.worker.js"

export function makeValidationWorker() {
  var worker = new BareValidationWorker()
  var validationWorker = new PromiseWorker(worker)

  function runValidation({ specSelectors, errActions, mode }) {
    let specStr = specSelectors.specStr()

    if(specStr.trim().length === 0) {
      // don't run validation if spec is empty
      return
    }

    return validationWorker.postMessage({
      mode,
      jsSpec: specSelectors.specJson().toJS(),
      specStr
    }).then(function (validationErrors) {
      errActions.clear({
        source: "schema"
      })

      // Filter out anything funky
      validationErrors = validationErrors
        .filter(val => typeof val === "object" && val !== null)

      if(validationErrors.length) {
        errActions.newSpecErrBatch(validationErrors)
      }
    }).catch(function (e) {
      console.error(e)
    })
  }

  return debounce(runValidation, 1200)
}
