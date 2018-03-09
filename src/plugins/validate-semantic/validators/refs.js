export const validateRefPathFormatting = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((refArtifacts) => {

    const errors = []
    refArtifacts.forEach((node) => {
      const value = node.node
      if(typeof value === "string") {
        // eslint-disable-next-line no-unused-vars
        const [refUrl, refPath] = value.split("#")

        if(!refPath || refPath[0] !== "/") {
          errors.push({
            // $ref instead of $$ref
            path: [...node.path.slice(0, -1), "$ref"],
            message: "$ref paths must begin with `#/`",
            level: "error"
          })
        }
      }
    })

    return errors
  })
}
