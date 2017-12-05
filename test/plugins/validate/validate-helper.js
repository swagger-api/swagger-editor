import ValidatePlugin from "plugins/validate"
// TODO: TEMP: in case I need to modify swagger-ui on the fly
// delete require.cache[require.resolve('swagger-ui')]

export default function validateHelper(spec) {
  return new Promise((resolve) => {
    const SwaggerUi = require("swagger-ui")
    const system = SwaggerUi({
      spec,
      plugins: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        ValidatePlugin
      ]
    })

    system.validateActions.all()
    setTimeout(resolve.bind(null, system), 50)
  })
}
