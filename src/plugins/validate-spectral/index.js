// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateJsonSpec` is dispatched.

export const updateJsonSpec = (ori, { specActions }) => (...args) => {
    ori(...args)

    const [spec] = args
    specActions.validateSpec(spec)
}

//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => (arg) => {
    // NOTE: This assumes that the REST API is available under the same host
    // TODO: This might need to use a different ruleset depending on input
    fetch("/oas-validation/api/validate?ruleset=v5", {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: arg.specSelectors.specStr(),
    }).then(response => response.json()).then(response => {
        const errors = response.map((entry) => {
            return {
                level: "error",
                message: entry.message,
                path: entry.path,
                line: entry.range.start.line
            }
        })
        if (errors.length > 0) {
            arg.errActions.newSpecErrBatch(errors)
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
                },
                wrapActions: {
                    updateJsonSpec
                }
            }
        }
    }
}
