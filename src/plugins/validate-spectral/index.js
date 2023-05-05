// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateJsonSpec` is dispatched.
import debounce from "lodash/debounce"
export const updateJsonSpec = (ori, { specActions }) => (...args) => {
    ori(...args)

    const [spec] = args
    specActions.validateSpec(spec)
}
const bounceErrors = debounce((errors, f) => {
    f(errors)
}, 500)
const SOURCE = "spectral"

/*
 We might have in-flight validation attempts
 that need to be cancelled when a new one is about to be issued
 or we risk getting the same issue displayed multiple times
 if the timing is exactly right/wrong and both complete after all `arg.errActions.clear` have run.

 To work around this we use an AbortController, fetch has builtin support for that.
 Sadly the easy solution of globally creating a controller and then simply sending an abort()
 on every run of validateSpec will immediately cancel the new fetch that is supposed to happen.

 To work around this a new AbortController is constructed on every run of validateSpec and stored in the controller variable.
 The controller variable is null at start and will be set back to null after every fetch() call.
 If it isn't null when validateSpec is called then this must mean that a request is currently going on and that can be cancelled.
 Overriding the controller afterwards with a new AbortController will avoid the signal also cancelling the new fetch() call
*/
let controller = null
const ABORT_SIGNAL = "new validation request; aborting the current one";
//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => (arg) => {
    // This not being null means a request is going on, cancel that
    if (controller != null) {
        controller.abort(ABORT_SIGNAL)
    }
    arg.errActions.clear({
        source: SOURCE
    })
    const severityToLevel = {
        0: "error",
        1: "warning",
        2: "info",
        3: "info",
        4: "info",
    }
    const ruleSet = arg.topbarSelectors.spectralVersion()

    // Create a new AbortController specific to this run of validateSpec
    // Has to be stored in the global scope as future calls to validateSpec have to access it
    controller = new AbortController();
    const { signal } = controller;
    // NOTE: This assumes that the REST API is available under the same host
    // TODO: This might need to use a different ruleset depending on input
    fetch(SPECTRAL_HOST + "/valigator/api/validate?ruleset=" + ruleSet, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: arg.specSelectors.specStr(),
        // This should automatically attach a handler that listens to the AbortController
        signal
    }).then(response => response.json()).then(response => {
        const errors = response.map((entry) => {
            return {
                level: severityToLevel[entry.severity],
                message: entry.message,
                path: entry.path.join("."),
                line: entry.range.start.line + 1,
                source: SOURCE
            }
        })
        if (errors.length > 0) {
            bounceErrors(errors, arg.errActions.newThrownErrBatch)
        }
    }
    ).catch((error) => {
        if (error === ABORT_SIGNAL) {
            console.info(error)
        } else {
            console.error("Error:", error)
        }
        // Always set the controller to null, no matter if the fetch call actually was successful or not
    }).finally(() => controller = null);
}

export default function() {
    return {
        statePlugins: {
            spec: {
                actions: {
                    validateSpec,
                }
            }
        }
    }
}
