import React from "react"
import PropTypes from "prop-types"

export default class EditorContainer extends React.Component {

  // This is already debounced by editor.jsx
  onChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    let { specSelectors, getComponent, errSelectors, fn, editorSelectors, configsSelectors } = this.props

    let Editor = getComponent("Editor")

    let wrapperClasses = ["editor-wrapper"]
    const readOnly = !!configsSelectors.get("readOnly")

    if(readOnly) {
      wrapperClasses.push("read-only")
    }

    let propsForEditor = this.props

    const editorOptions = {
      enableLiveAutocompletion: configsSelectors.get("editorLiveAutocomplete"),
      readOnly: readOnly,
      highlightActiveLine: !readOnly,
      highlightGutterLine: !readOnly,
    }

    return (
      <div id='editor-wrapper' className={wrapperClasses.join(" ")}>
        { readOnly ? <h2 className="editor-readonly-watermark">Read Only</h2> : null }
        <Editor
          {...propsForEditor}
          value={specSelectors.specStr()}
          origin={specSelectors.specOrigin()}
          editorOptions={editorOptions}
          specObject={specSelectors.specJson().toJS()}
          errors={errSelectors.allErrors()}
          onChange={this.onChange}
          goToLine={editorSelectors.gotoLine()}
          AST={fn.AST}
        />
    </div>
    )
  }

}

EditorContainer.defaultProps = {
  onChange: Function.prototype
}

EditorContainer.propTypes = {
  specActions: PropTypes.object.isRequired,
  configsSelectors: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  fn: PropTypes.object,
  specSelectors: PropTypes.object.isRequired,
  errSelectors: PropTypes.object.isRequired,
  editorSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
}
