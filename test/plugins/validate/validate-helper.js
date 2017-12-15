import ValidatePlugin from "plugins/validate"
import ASTPlugin from "plugins/ast"

export default function validateHelper(spec) {

  // TODO: TEMP: in case I need to modify swagger-ui on the fly
  delete require.cache[require.resolve('swagger-ui')]

  return new Promise((resolve) => {
    const SwaggerUi = require("swagger-ui")

    const DummySwaggerJsPlugin = {
      fn: {
        resolve: a => Promise.resolve(a)
      }
    }
    const system = SwaggerUi({
      spec,
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
