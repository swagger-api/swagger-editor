import concat from "lodash/concat"
import { validate } from "./structural-validation/validator"
import { runSemanticValidators } from "./semantic-validators/hook"
import { getLineNumberForPath } from "../ast/ast"
import getTimestamp from "./get-timestamp"
import registerPromiseWorker from "promise-worker/register"
import modes from "./modes"

registerPromiseWorker(function ({ jsSpec, resolvedSpec, specStr, mode }) {
  let boundGetLineNumber = getLineNumberForPath.bind(null, specStr)

  if(!modes[mode]) {
    return console.error("WARNING: Validation plugin was supplied an invalid mode. Skipping validation.")
  }

  let settings = modes[mode]

  let inputs = {
    jsSpec,
    resolvedSpec,
    specStr,
    settings,
    getLineNumberForPath: boundGetLineNumber
  }

  let perfArray = []
  let LOG_VALIDATION_PERF = process.env.NODE_ENV !== "production"

  let markStep = (step) => perfArray.push({ step, stamp: getTimestamp() })
  markStep("origin")

  // Generate errors based on the spec
  let structuralValidationResult = settings.runStructural ? validate(inputs) : []
  markStep("structural")

  let semanticValidatorResult = settings.runSemantic ? runSemanticValidators(inputs) : []
  markStep("semantic")

  let combinedErrors = concat([], semanticValidatorResult, structuralValidationResult)
  markStep("combine")

  if(LOG_VALIDATION_PERF) {
    perfArray.forEach((el, i) => {
      if(i === 0) return
      // eslint-disable-next-line no-console
      console.log(`${el.step} took ${el.stamp - perfArray[i-1].stamp}ms`)
    })
  }

  return combinedErrors
})
