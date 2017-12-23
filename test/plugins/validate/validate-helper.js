import expect from "expect"
import SwaggerUi from "swagger-ui"

import ValidatePlugin from "plugins/validate"
import ASTPlugin from "plugins/ast"

export default function validateHelper(spec) {
  return new Promise((resolve) => {
    const DummySwaggerJsPlugin = {
      fn: {
        resolve: a => Promise.resolve(a)
      }
    }
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [],
      initialState: {
        layout: undefined
      },
      plugins: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        SwaggerUi.plugins.DownloadUrl,
        DummySwaggerJsPlugin,
        ASTPlugin,
        ValidatePlugin,

      ]
    })
    system.validateActions.all()
    setTimeout(resolve.bind(null, system), 60)
  })

}

export function expectNoErrorsOrWarnings(spec) {
  return validateHelper(spec)
    .then( system => {
      const allErrors = system.errSelectors.allErrors().toJS()
      expect(allErrors).toEqual([])
    })
}

export function expectNoErrors(spec) {
  return validateHelper(spec)
    .then(system => {
      let allErrors = system.errSelectors.allErrors().toJS()
      allErrors = allErrors.filter(a => a.level === "error") // ignore warnings
      expect(allErrors).toEqual([])
    })
}
