// TODO: Turn these into actions, that we can override
import GutterClick from "./gutter-click"
import JsonToYaml from "./json-to-yaml"
import TabHandler from "./tab-handler"

const plugins = [
  {fn: GutterClick, name: "gutterClick"},
  {fn: JsonToYaml, name: "jsonToYaml"},
  {fn: TabHandler, name: "tabHandler"},
]

export default function (editor, props = {}, editorPluginsToRun = [], helpers = {}) {
  plugins
    .filter(plugin => ~editorPluginsToRun.indexOf(plugin.name))
    .forEach( plugin => {
      try {
        plugin.fn(editor, props, helpers)
      } catch(e) {
        console.error(`${plugin.name || ""} plugin error:`, e)
      }
    })
}
