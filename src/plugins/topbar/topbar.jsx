import React, { PropTypes } from "react"
import DropdownMenu from "react-dd-menu"
import downloadFile from "react-file-download"
import YAML from "js-yaml"
import beautifyJson from "json-beautify"

import "./topbar.less"
import "react-dd-menu/dist/react-dd-menu.css"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      isMenuOpen: false
    }
  }

  toggleMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  };

  closeMenu = () => {
    this.setState({ isMenuOpen: false })
  };

  importFromURL = () => {
    let url = prompt("Enter the URL to import from:")

    if(url) {
      this.props.specActions.updateUrl(url)
      this.props.specActions.download(url)
    }
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

  render() {
    let { getComponent } = this.props
    const Link = getComponent("Link")

    let menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.closeMenu.bind(this),
      toggle: <span className="menu-item" onClick={this.toggleMenu.bind(this)}>File</span>,
      align: "left",
    }

    return (
      <div>
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="30" width="30" className="topbar-logo__img" src={ Logo } alt=""/>
              <span className="topbar-logo__title">Swagger Editor</span>
            </Link>
            <DropdownMenu {...menuOptions}>
              <li><button type="button" onClick={this.importFromURL}>Import URL</button></li>
              <li><button type="button" onClick={null}>Import File</button></li>
              <li role="separator"></li>
              <li><button type="button" onClick={this.saveAsYaml}>Download YAML</button></li>
              <li><button type="button" onClick={this.saveAsJson}>Download JSON</button></li>
            </DropdownMenu>
          </div>
        </div>
      </div>

    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}
