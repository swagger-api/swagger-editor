// export * from './ast.js'
// These import/exports are shared code between worker and main bundle.
// Putting them here keeps the distiction clear
export { getLineNumberForPath } from "../../ast/ast.js"
