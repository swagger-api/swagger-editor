import React, { PropTypes } from "react"
import DropdownMenu from "react-dd-menu"
import Modal from "boron/DropModal"
import downloadFile from "react-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"

import "./topbar.less"
import "react-dd-menu/dist/react-dd-menu.css"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  // Menu actions

  importFromURL = () => {
    let url = prompt("Enter the URL to import from:")

    if(url) {
      this.props.specActions.updateUrl(url)
      this.props.specActions.download(url)
    }
  }

  importFromFile = () => {
    let [fileToLoad] = this.refs.fileLoadInput.files

    let fileReader = new FileReader()

    fileReader.onload = fileLoadedEvent => {
      let textFromFileLoaded = fileLoadedEvent.target.result
      this.props.specActions.updateSpec(textFromFileLoaded)
      this.hideModal()
    }

    fileReader.readAsText(fileToLoad, "UTF-8")
  }

  saveAsYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let yamlContent = YAML.safeDump(jsContent)
    downloadFile(yamlContent, "swagger.yaml")
  }

  saveAsJson = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let prettyJsonContent = beautifyJson(jsContent, null, 2)
    downloadFile(prettyJsonContent, "swagger.json")
  }

  saveAsText = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    downloadFile(editorContent, "swagger.txt")
  }

  convertToYaml = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    let jsContent = YAML.safeLoad(editorContent)
    let yamlContent = YAML.safeDump(jsContent)
    this.props.specActions.updateSpec(yamlContent)
  }

  // Helpers

  showModal = () => {
    this.refs.modal.show()
  }

  hideModal = () => {
    this.refs.modal.hide()
  }

  render() {
    let { getComponent } = this.props
    const Link = getComponent("Link")

    let makeMenuOptions = (name) => {
      let stateKey = `is${name}MenuOpen`
      let toggleFn = () => this.setState({ [stateKey]: !this.state[stateKey] })
      return {
        isOpen: this.state[stateKey],
        close: () => this.setState({ [stateKey]: false }),
        align: "left",
        toggle: <span className="menu-item" onClick={toggleFn}>{ name }</span>
      }
    }

    return (
      <div>
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="30" width="30" className="topbar-logo__img" src={ Logo } alt=""/>
              <span className="topbar-logo__title">Swagger Editor</span>
            </Link>
            <DropdownMenu {...makeMenuOptions("File")}>
              <li><button type="button" onClick={this.importFromURL}>Import URL</button></li>
              <li><button type="button" onClick={this.showModal}>Import File</button></li>
              <li role="separator"></li>
              <li><button type="button" onClick={this.saveAsYaml}>Download YAML</button></li>
              <li><button type="button" onClick={this.saveAsJson}>Download JSON</button></li>
            </DropdownMenu>
            <DropdownMenu {...makeMenuOptions("Edit")}>
              <li><button type="button" onClick={this.convertToYaml}>Convert to YAML</button></li>
            </DropdownMenu>
          </div>
        </div>
        <Modal className="swagger-ui modal" ref="modal">
          <div className="container">
            <h2>Upload file</h2>
            <input type="file" ref="fileLoadInput"></input>
          </div>
          <div className="right">
            <button className="btn cancel" onClick={this.hideModal}>Cancel</button>
            <button className="btn" onClick={this.importFromFile}>Open file</button>
          </div>
        </Modal>
      </div>

    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}
