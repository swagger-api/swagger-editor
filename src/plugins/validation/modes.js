import apiSchema from "./apis/schema"

export default {
  "apis": {
    schemas: [apiSchema], // the API schema references itself by URL, so we have to preload it
    testSchema: apiSchema,
    runStructural: true,
    runSemantic: true
  }
}
