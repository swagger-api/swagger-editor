/**
 * Unescapes a JSON pointer.
 * @api public
 */
export function unescapeJsonPointerToken(token) {
  if (typeof token !== "string") {
    return token
  }
  return token.replace(/~1/g, "/").replace(/~0/g, "~")
}

/**
 * Escapes a JSON pointer.
 * @api public
 */
export function escapeJsonPointerToken(token) {
  return token.replace(/~/g, "~0").replace(/\//g, "~1")
}
