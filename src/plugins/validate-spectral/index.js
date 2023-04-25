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
//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => (arg) => {
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

    // NOTE: This assumes that the REST API is available under the same host
    // TODO: This might need to use a different ruleset depending on input
    fetch(SPECTRAL_HOST + "/valigator/api/validate?ruleset=" + ruleSet, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: arg.specSelectors.specStr(),
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
        console.error("Error:", error)
    })
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
