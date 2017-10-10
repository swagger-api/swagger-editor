import React, { PropTypes } from "react"
import AceEditor from "react-ace"
import editorPluginsHook from "../editor-plugins/hook"
import { placeMarkerDecorations } from "../editor-helpers/marker-placer"
import Im, { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"

import ace from "brace"
import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"
import "./brace-snippets-yaml"

import "./editor.less"

const NOOP = Function.prototype // Apparently the best way to no-op


export default function makeEditor({ editorPluginsToRun }) {

  class Editor extends React.Component {

    constructor(props, context) {
      super(props, context)
      if(props.value) {
        this.yaml = props.value
      }
      this.state = {
        editor: null,
        value: props.value || "",
      }

      // see https://gist.github.com/Restuta/e400a555ba24daa396cc
      this.onClick = this.onClick.bind(this)
    }

    onChange = (value) => {
      // Set the value in state, now - so that we don't have lag
      this.setState({ value })
      // Send it upstream
      this.props.onChange(value)
    }

    onLoad = (editor) => {
      let { props, state } = this
      let { AST, specObject } = props

      let langTools = ace.acequire("ace/ext/language_tools")

      state.editor = editor // TODO: get editor out of state
      editor.getSession().setUseWrapMode(true)

      let session = editor.getSession()

      session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
        session.setScrollLeft(0)
      })

      // TODO Remove this in favour of editorActions.onLoad
      editorPluginsHook(editor, props, editorPluginsToRun || [], {
        langTools, AST, specObject
      })


      editor.setHighlightActiveLine(false)
      editor.setHighlightActiveLine(true)

      props.editorActions.onLoad({...props, langTools, editor})
    }

    onResize = () => {
      let { state: { editor } } = this
      if(editor) {
        let session = editor.getSession()
        editor.resize()
        let wrapLimit = session.getWrapLimit()
        editor.setPrintMarginColumn(wrapLimit)
      }
    }

    onClick = () => {
      // onClick is deferred by 40ms, to give element resizes time to settle.
      setTimeout(() => {
        if(this.getWidth() !== this.state.width) {
          this.onResize()
          this.setState({ width: this.getWidth() })
        }
      }, 40)
    }

    getWidth = () => {
      let el = document.getElementById("editor-wrapper")

      return el ? el.getBoundingClientRect().width : null
    }

    updateErrorAnnotations = (nextProps) => {
      if(this.state.editor && nextProps.errors) {
        let editorAnnotations = nextProps.errors.toJS().map(err => {
          // Create annotation objects that ACE can use
          return {
            row: err.line - 1,
            column: 0,
            type: err.level,
            text: err.message
          }
        })

        this.state.editor.getSession().setAnnotations(editorAnnotations)
      }
    }

    setReadOnlyOptions = (nextProps) => {
      let { state } = this

      if(nextProps.readOnly === true && state.editor) {
        state.editor.setOptions({
          readOnly: true,
          highlightActiveLine: false,
          highlightGutterLine: false
        })
      } else if(state.editor) {
        state.editor.setOptions({
          readOnly: false,
          highlightActiveLine: true,
          highlightGutterLine: true
        })
      }
    }

    updateMarkerAnnotations = (nextProps, { force } = {}) => {
      let { state } = this
      let { onMarkerLineUpdate } = nextProps

      // FIXME: this is a hacky solution.
      // we should find a way to wait until the spec has been loaded into ACE.
      if(force === true || this.props.specId !== nextProps.specId || !Im.is(this.props.markers, nextProps.markers)) {
        const markers = Im.Map.isMap(nextProps.markers) ? nextProps.markers.toJS() : {}
        setTimeout(placeMarkerDecorations.bind(null, {
          editor: state.editor,
          markers,
          onMarkerLineUpdate,
        }), 300)
      }
    }

    componentWillMount() {
      // add user agent info to document
      // allows our custom Editor styling for IE10 to take effect
      var doc = document.documentElement
      doc.setAttribute("data-useragent", navigator.userAgent)
    }

    componentDidMount() {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ width: this.getWidth() })
      document.addEventListener("click", this.onClick)

      if(this.props.markers) {
        this.updateMarkerAnnotations({ markers: this.props.markers }, { force: true })
      }
    }

    componentWillReceiveProps(nextProps) {
      let { state } = this
      let hasChanged = (k) => !isEqual(nextProps[k], this.props[k])
      let wasEmptyBefore = (k) => nextProps[k] && (!this.props[k] || isEmpty(this.props[k]))

      this.updateErrorAnnotations(nextProps)
      this.setReadOnlyOptions(nextProps)
      this.updateMarkerAnnotations(nextProps)

      if(state.editor && nextProps.goToLine && hasChanged("goToLine")) {
        state.editor.gotoLine(nextProps.goToLine.line)
      }

      this.setState({
        shouldClearUndoStack: hasChanged("specId") || wasEmptyBefore("value"),
      })

    }

    yaml = this.yaml || "";

    shouldComponentUpdate(nextProps) {
      const oriYaml = this.yaml
      this.yaml = nextProps.value

      return oriYaml !== nextProps.value
    }

    render() {
      let { readOnly } = this.props
      const value = this.yaml

      return (
            <AceEditor
              value={value}
              mode="yaml"
              theme="tomorrow_night_eighties"
              onLoad={this.onLoad}
              onChange={this.onChange}
              name="ace-editor"
              width="100%"
              height="100%"
              tabSize={2}
              fontSize={14}
              readOnly={readOnly}
              useSoftTabs="true"
              wrapEnabled={true}
              editorProps={{
                "display_indent_guides": true,
                folding: "markbeginandend"
              }}
              setOptions={{
                cursorStyle: "smooth",
                wrapBehavioursEnabled: true
              }}
            />
      )
    }

    componentDidUpdate() {
      let { shouldClearUndoStack, editor } = this.state

      if(shouldClearUndoStack) {
        setTimeout(function () {
          editor.getSession().getUndoManager().reset()
        }, 100)
      }

    }

    componentWillUnmount() {
      document.removeEventListener("click", this.onClick)
    }

  }

  Editor.propTypes = {
    specId: PropTypes.string,
    value: PropTypes.string,

    onChange: PropTypes.func,
    onMarkerLineUpdate: PropTypes.func,

    readOnly: PropTypes.bool,

    markers: PropTypes.object,
    goToLine: PropTypes.object,
    specObject: PropTypes.object.isRequired,

    AST: PropTypes.object.isRequired,

    errors: ImPropTypes.list,
  }

  Editor.defaultProps = {
    value: "",
    specId: "--unknown--",
    onChange: NOOP,
    onMarkerLineUpdate: NOOP,
    markers: {},
    readOnly: false,
    goToLine: {},
    errors: fromJS([]),
  }

  return Editor
}
