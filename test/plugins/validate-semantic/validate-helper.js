import expect from "expect"
import SwaggerUi from "swagger-ui"

import ValidateBasePlugin from "plugins/validate-base"
import ValidateSemanticPlugin from "plugins/validate-semantic"
import ASTPlugin from "plugins/ast"

const DELAY_MS = 130

export default function validateHelper(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        SwaggerUi.plugins.DownloadUrl,
        SwaggerUi.plugins.SwaggerJsIndex,
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        ASTPlugin,
        ValidateBasePlugin,
        ValidateSemanticPlugin,

      ]
    })
    system.validateActions.all()
    setTimeout(() => {
      resolve(system)
    }, DELAY_MS)
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
