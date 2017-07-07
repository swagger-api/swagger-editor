// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = "/dist/"

import PromiseWorker from "promise-worker"
import debounce from "lodash/debounce"
import BareValidationWorker from "./validation.worker.js"

export function makeValidationWorker() {
  var worker = new BareValidationWorker()
  var validationWorker = new PromiseWorker(worker)

  function runValidation({ specSelectors, errActions, resolvedSpec, mode }) {
    let specStr = specSelectors.specStr()

    if(specStr.trim().length === 0) {
      // don't run validation if spec is empty
      return
    }

    if(specSelectors.isOAS3 && specSelectors.isOAS3()) {
      // Don't run validation against OAS3 specs
      return
    }

    return validationWorker.postMessage({
      mode,
      jsSpec: specSelectors.specJson().toJS(),
      resolvedSpec,
      specStr
    }).then(function (validationErrors) {
      errActions.clear({
        source: "schema"
      })
      errActions.clear({
        source: "semantic"
      })
      if(validationErrors.length) {
        validationErrors.forEach(err => {
          errActions.newSpecErr(err)
        })
      }
    }).catch(function (e) {
      console.error(e)
    })
  }

  return debounce(runValidation, 1200)
}
