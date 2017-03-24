import React, { PropTypes } from "react"
import debounce from "lodash/debounce"


const DEBOUNCE_TIME = 800 // 0.5 imperial seconds™

export default class EditorContainer extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.onChange = debounce(this._onChange.bind(this), DEBOUNCE_TIME)
  }

  _onChange(value) {
    if(typeof this.props.onChange === "function") {
      this.props.onChange(value)
    }
    this.props.specActions.updateSpec(value)
  }

  render() {
    let { specSelectors, getComponent, errSelectors, fn, readOnly, editorSelectors } = this.props

    let Editor = getComponent("Editor")

    let wrapperClasses = ["editor-wrapper"]

    if(readOnly) {
      wrapperClasses.push("read-only")
    }

    let propsForEditor = this.props

    return (
      <div id='editor-wrapper' className={wrapperClasses.join(" ")}>
        { readOnly ? <h2 className="editor-readonly-watermark">Read Only</h2> : null }
        <Editor
          {...propsForEditor}
          value={specSelectors.specStr()}
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
  onChange: PropTypes.func,
  fn: PropTypes.object,
  specSelectors: PropTypes.object.isRequired,
  errSelectors: PropTypes.object.isRequired,
  editorSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
}
