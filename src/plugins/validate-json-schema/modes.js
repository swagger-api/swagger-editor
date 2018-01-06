import swagger2Schema from "./structural-validation/swagger2-schema"
import oas3Schema from "./structural-validation/oas3-schema"

export default {
  "swagger2": {
    schemas: [swagger2Schema], // the swagger2 schema references itself by URL, so we have to preload it
    testSchema: swagger2Schema,
    runStructural: true
  },
  "oas3": {
    schemas: [oas3Schema],
    testSchema: oas3Schema,
    runStructural: true
  }
}
