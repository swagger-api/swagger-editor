let request = require.context("./", true, /\.js$/)
let plugins = []

request.keys().forEach( function( key ){
  if( key === "./hook.js" ) {
    return
  }

  if( key.slice(2).indexOf("/") > -1) {
    // skip files in subdirs
    return
  }

  plugins.push({
    name: toTitleCase(key),
    fn: request(key).default
  })
})

export default function (editor, props = {}, editorPluginsToRun = [], helpers = {}) {
  // TODO: refactor require context system to direct plugin references
  plugins.forEach( (plugin) => {
    if(editorPluginsToRun.indexOf(plugin.name) > -1) {
      try {
        plugin.fn(editor, props, helpers)
      } catch(e) {
        console.error(`${toTitleCase(plugin.name.slice(2)) || ""} plugin error:`, e)
      }
    }
  })
}

function toTitleCase(str) {
  return str
    .split("-")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join("")
    .replace(/\.js/g, "") // .js
    .replace(/\.\//g, "") // ./
}
