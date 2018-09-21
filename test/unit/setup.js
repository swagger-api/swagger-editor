if (typeof process === "object") {
  require("jsdom-global")()
}

require.extensions[".less"] = () => null