import get from "lodash/get"
import { escapeJsonPointerToken } from "../../../refs-util"
import qs from "querystring-browser"
import { pathFromPtr } from "json-refs"

export const validate2And3RefHasNoSiblings = () => system => {
  return system.validateSelectors.all$refs()
  .then((nodes) => {
      const immSpecJson = system.specSelectors.specJson()
      const specJson = immSpecJson.toJS ? immSpecJson.toJS() : {}

      return nodes.reduce((acc, node) => {
        const unresolvedValue = get(specJson, node.parent.path) || {}
        const unresolvedKeys = Object.keys(unresolvedValue) || []
        const isPathItem = node.parent.key === "paths" && node.path.length === 2

        unresolvedKeys.forEach(k => {
          if(!isPathItem && k !== "$ref" && unresolvedKeys.indexOf("$ref") > -1) {
            acc.push({
              message: `Sibling values alongside $refs are ignored.\nTo add properties to a $ref, wrap the $ref into allOf, or move the extra properties into the referenced definition (if applicable).`,
              path: [...node.path.slice(0, -1), k],
              level: "warning"
            })
          }
        })
        return acc
      }, [])
    })
}

// Add warnings for unused definitions
export const validate2And3UnusedDefinitions = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((nodes) => {
    const references = nodes.map(node => node.node)
    const errors = []
    const basePath = system.specSelectors.isOAS3() ?
      ["components", "schemas"] :
      ["definitions"]

    system.specSelectors.definitions()
    .forEach((val, key) => {
      const escapedKey = escapeJsonPointerToken(key)
      if(references.indexOf(`#/${basePath.join("/")}/${escapedKey}`) < 0) {
        const path = [...basePath, key]
        errors.push({
          level: "warning",
          path,
          message: "Definition was declared but never used in document"
        })
      }
    })

    return errors
  })
}

export const validate2And3RefPathFormatting = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((refArtifacts) => {

    const errors = []
    refArtifacts.forEach((node) => {
      const value = node.node
      if(typeof value === "string") {
        // eslint-disable-next-line no-unused-vars
        const [refUrl, refPath] = value.split("#")

        if(refPath && refPath[0] !== "/") {
          errors.push({
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

export const validate2And3RefPointersExist = () => (system) => {
  const json = system.specSelectors.specJson()
  return system.validateSelectors.all$refs()
  .then((refs) => {
    const errors = []

    refs.forEach((node) => {
      const value = node.node
      if(typeof value === "string" && value[0] === "#") {
        // if pointer starts with "#", it is a local ref
        let path
        try {
          path = pathFromPtr(qs.unescape(value))
          if(json.getIn(path) === undefined) {
            errors.push({
              path: [...node.path.slice(0, -1), "$ref"],
              message: "$refs must reference a valid location in the document",
              level: "error"
            })
          }
        } catch (e) {
          // pathFromPtr from json-refs lib will throw new Error
        }
      }
    })

    return errors
  })
}

// from RFC3986: https://tools.ietf.org/html/rfc3986#section-2.2
// plus "%", since it is needed for encoding.
const RFC3986_UNRESERVED_CHARACTERS = /[A-Za-z0-9\-_\.~%]/g

export const validate2And3RefPointersAreProperlyEscaped = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((refs) => {
    const errors = []

    refs.forEach((node) => {
      const value = node.node
      const hashIndex = value.indexOf("#")
      const fragment = hashIndex > -1 ? value.slice(hashIndex + 1) : null
      if(typeof fragment === "string") {
        const rawPath = fragment.split("/")
        const hasReservedChars = rawPath
          .some(p => p.replace(RFC3986_UNRESERVED_CHARACTERS, "").length > 0)

        if(hasReservedChars) {
          errors.push({
            path: [...node.path.slice(0, -1), "$ref"],
            message: "$ref values must be RFC3986-compliant percent-encoded URIs",
            level: "error"
          })
        }
      }
    })

    return errors
  })
}
