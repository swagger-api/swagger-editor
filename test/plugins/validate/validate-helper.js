import ValidatePlugin from "plugins/validate"
import ASTPlugin from "plugins/ast"

export default function validateHelper(spec) {
  return new Promise((resolve) => {
    const SwaggerUi = require("swagger-ui")

    const DummySwaggerJsPlugin = {
      fn: {
        resolve: a => Promise.resolve(a)
      }
    }
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [],
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
    setTimeout(resolve.bind(null, system), 50)
  })

}
