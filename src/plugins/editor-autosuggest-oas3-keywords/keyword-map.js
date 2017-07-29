import {
  ExternalDocumentation,
  Info,
  SecurityRequirement,
  Server,
  Tag,
  Components,
  Paths
} from "./oas3-objects.js"

export default {
  openapi: String,
  info: Info,
  servers: [Server],
  paths: Paths,
  components: Components,
  security: [SecurityRequirement],
  tags: [Tag],
  externalDocs: ExternalDocumentation
}
