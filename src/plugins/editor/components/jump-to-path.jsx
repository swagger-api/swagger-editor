import React, { PropTypes } from "react"
import JumpIcon from "./jump-icon.svg"

export default class JumpToPath extends React.Component {
  static propTypes = {
    editorActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    path: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]).isRequired,
    content: PropTypes.element,
    showButton: PropTypes.bool
  }

  shouldComponentUpdate(nextProps) {
    let { shallowEqualKeys } = nextProps.fn
    return shallowEqualKeys(this.props, nextProps, [
      "content", "showButton", "path"
    ])
  }

  jumpToPath = (e) => {
    e.stopPropagation()

    let { path, fn: { AST, transformPathToArray }, specSelectors: { specStr, specJson }, editorActions } = this.props
    let line = AST.getLineNumberForPath(specStr(), typeof path === "string" ? transformPathToArray(path, specJson().toJS()) : path)
    editorActions.jumpToLine(line)
  }


  defaultJumpContent = <img src={JumpIcon} onClick={this.jumpToPath} className="view-line-link" />

  render() {
    let { content, showButton } = this.props

    if (content) {
      // if we were given content to render, wrap it
      return (
        <span onClick={ this.jumpToPath }>
          { showButton ? this.defaultJumpContent : null }
          {content}
        </span>
      )
    } else {
      // just render a link
      return this.defaultJumpContent

    }
  }
}
