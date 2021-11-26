import React from "react"
import PropTypes from "prop-types"

import JumpIcon from "./jump-icon.svg"

class JumpToPath extends React.Component {
  static propTypes = {
    editorActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    path: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    content: PropTypes.element,
    showButton: PropTypes.bool,
    specPath: PropTypes.array, // The location within the spec. Used as a fallback if `path` doesn't exist
  }

  static defaultProps = {
    path: "",
  }

  shouldComponentUpdate(nextProps) {
    let { shallowEqualKeys } = nextProps.fn
    return shallowEqualKeys(this.props, nextProps, [
      "content", "showButton", "path", "specPath"
    ])
  }

  jumpToPath = (e) => {
    e.stopPropagation()

    const {
      specPath=[],
      path,
      specSelectors,
      editorActions
    } = this.props

    const jumpPath = specSelectors.bestJumpPath({path, specPath})
    editorActions.jumpToLine(specSelectors.getSpecLineFromPath(jumpPath))
  }


  defaultJumpContent = <img src={JumpIcon} onClick={this.jumpToPath} className="view-line-link" title={"Jump to definition"} />

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

export default JumpToPath
