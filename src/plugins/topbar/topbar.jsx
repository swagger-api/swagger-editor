import React, { PropTypes } from "react"
import DropdownMenu from 'react-dd-menu'
import downloadFile from 'react-file-download'
import YAML from "js-yaml"

import "./topbar.less"
import "react-dd-menu/dist/react-dd-menu.css"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      isMenuOpen: false
    };
  }

  toggleMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  closeMenu = () => {
    this.setState({ isMenuOpen: false });
  };

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
    let jsonContent = JSON.stringify(jsContent)
    downloadFile(jsonContent, "swagger.json")
  }

  saveAsText = () => {
    // Editor content -> JS object -> YAML string
    let editorContent = this.props.specSelectors.specStr()
    downloadFile(editorContent, "swagger.txt")
  }

  render() {
    let { getComponent } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.closeMenu.bind(this),
      toggle: <span className="menu-item" onClick={this.toggleMenu.bind(this)}>File</span>,
      align: 'left',
    };

    return (
      <div>
        <div className="topbar">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="30" width="30" className="topbar-logo__img" src={ Logo } alt=""/>
              <span className="topbar-logo__title">Swagger Editor</span>
            </Link>
            <DropdownMenu {...menuOptions}>
              <li><button type="button" onClick={this.saveAsYaml}>Save as YAML</button></li>
              <li><button type="button" onClick={this.saveAsJson}>Save as JSON</button></li>
              <li><button type="button" onClick={this.saveAsText}>Save as text</button></li>
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
