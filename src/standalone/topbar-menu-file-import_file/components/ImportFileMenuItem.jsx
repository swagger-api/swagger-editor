import React, { Component } from "react"
import PropTypes from "prop-types"

import fileDialog from "file-dialog"
import YAML from "js-yaml"
import isJsonObject from "is-json"

export default class ImportFileMenuItem extends Component {
  onClick = async () => {
    const { onDocumentLoad } = this.props
    const fileList = await fileDialog()

    const fileReader = new FileReader()

    fileReader.onload = fileLoadedEvent => {
      let content = fileLoadedEvent.target.result

      try {
        const preparedContent = isJsonObject(content) ? YAML.dump(YAML.load(content)) : content

        if (typeof onDocumentLoad === "function") {
          onDocumentLoad(preparedContent)
        }
      } catch(e) {
        alert(`Oof! There was an error loading your document:\n\n${e.message || e}`)
      }
    }

    fileReader.readAsText(fileList.item(0), "UTF-8")
  }
  render() {
    return <li>
      <button type="button" onClick={this.onClick}>Import file</button>
    </li>
  }
}

ImportFileMenuItem.propTypes = {
  onDocumentLoad: PropTypes.func.isRequired,
}
