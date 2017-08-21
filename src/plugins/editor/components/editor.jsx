import React, { PropTypes } from "react"
import AceEditor from "react-ace"
import editorPluginsHook from "../editor-plugins/hook"
import { placeMarkerDecorations } from "../editor-helpers/marker-placer"
import Im, { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

import isUndefined from "lodash/isUndefined"
import omit from "lodash/omit"
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

      this.editor = null
      this.yaml = props.value || ""
    }

    onChange = (value) => {
      // Set the value locally now - so that we don't have lag/feedback
      this.yaml = value
      // Send it upstream ( this.silent is taken from react-ace module). It avoids firing onChange, when we update setValue
      if(!this.silent) {
        this.props.onChange(value)
      }
    }

    onLoad = (editor) => {
      const { props } = this
      const { AST, specObject } = props

      const langTools = ace.acequire("ace/ext/language_tools")
      const session = editor.getSession()

      this.editor = editor

      session.setUseWrapMode(true)
      session.on("changeScrollLeft", xPos => { // eslint-disable-line no-unused-vars
        session.setScrollLeft(0)
      })

      // TODO Remove this in favour of editorActions.onLoad
      editorPluginsHook(editor, props, editorPluginsToRun || [], {
        langTools, AST, specObject
      })

      editor.setHighlightActiveLine(false)
      editor.setHighlightActiveLine(true)

      this.syncOptionsFromState(this.props.editorOptions)

      props.editorActions.onLoad({...props, langTools, editor})
    }

    onResize = () => {
      const { editor } = this
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
      if(this.editor && nextProps.errors) {
        let editorAnnotations = nextProps.errors.toJS().map(err => {
          // Create annotation objects that ACE can use
          return {
            row: err.line - 1,
            column: 0,
            type: err.level,
            text: err.message
          }
        })

        this.editor.getSession().setAnnotations(editorAnnotations)
      }
    }

    updateMarkerAnnotations = (props) => {
      const { editor } = this

      const markers = Im.Map.isMap(props.markers) ? props.markers.toJS() : {}
      this.removeMarkers = placeMarkerDecorations({
        editor,
        markers,
        onMarkerLineUpdate: props.onMarkerLineUpdate,
      })
    }

    componentWillMount() {
      // add user agent info to document
      // allows our custom Editor styling for IE10 to take effect
      var doc = document.documentElement
      doc.setAttribute("data-useragent", navigator.userAgent)
      this.syncOptionsFromState(this.props.editorOptions)
    }

    componentDidMount() {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ width: this.getWidth() })
      document.addEventListener("click", this.onClick)

      this.updateYaml()
      if(this.props.markers) {
        this.updateMarkerAnnotations(this.props)
      }
    }

    updateYaml = () => {
      // this.silent is taken from react-ace module. It avoids firing onChange, when we update setValue
      this.silent = true
      const pos = this.editor.session.selection.toJSON()
      this.editor.setValue(this.yaml)
      this.editor.session.selection.fromJSON(pos)
      this.silent = false
    }

    componentWillReceiveProps(nextProps) {
      let hasChanged = (k) => !isEqual(nextProps[k], this.props[k])
      let wasEmptyBefore = (k) => nextProps[k] && (!this.props[k] || isEmpty(this.props[k]))
      const editor = this.editor
      const newValue = nextProps.value

      // Mange the yaml lifecycle...

      // If the yaml doesn't match _what we already have in state_ then update the yaml in the editor
      // Taking care to manage the other things in lifecycle
      if(newValue != this.yaml) {
        this.yaml = newValue

        // Remove markers
        if(this.removeMarkers) {
          this.removeMarkers()
        }

        this.updateYaml()

        // Add back the markers
        this.updateMarkerAnnotations(this.props)

        // Clear undo-stack if we've changed specId or it was empty before
        if(hasChanged("specId") || wasEmptyBefore("value")) {
          setTimeout(function () {
            editor.getSession().getUndoManager().reset()
          }, 100) // TODO: get rid of timeout
        }
      } else {
        // Just update markers if they've changed
        if(!Im.is(nextProps.markers, this.props.markers)) {
          this.updateMarkerAnnotations(nextProps)
        }
      }

      // Whether or not the yaml changed....

      this.updateErrorAnnotations(nextProps)
      if(hasChanged("editorOptions")) {
        this.syncOptionsFromState(nextProps.editorOptions)
      }

      if(editor && nextProps.goToLine && hasChanged("goToLine")) {
        editor.gotoLine(nextProps.goToLine.line)
      }

    }

    syncOptionsFromState = (editorOptions) => {
      const { editor } = this
      if(!editor) {
        return
      }

      const setOptions = omit(editorOptions, ["readOnly"])
      editor.setOptions(setOptions)

      const readOnly = isUndefined(editorOptions.readOnly)
            ? false
            : editorOptions.readOnly // If its undefined, default to false.
      editor.setReadOnly(readOnly)
    }

    shouldComponentUpdate() {
      return false // Never update, see: this.updateYaml for where we update the yaml in the editor
      // TODO this might affect changes to the "onLoad", "onChange" props...
    }

    // shouldComponentUpdate(nextProps) {
    //   const oriYaml = this.yaml
    //   this.yaml = nextProps.value
    //   return oriYaml !== nextProps.value
    // }

    render() {
      // NOTE: we're manually managing the value lifecycle, outside of react render

      return (
            <AceEditor
              mode="yaml"
              theme="tomorrow_night_eighties"
              onLoad={this.onLoad}
              onChange={this.onChange}
              name="ace-editor"
              width="100%"
              height="100%"
              tabSize={2}
              fontSize={14}
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

    // componentWillUpdate() {
    //   console.log('MARK: componentWillUpdate')
    //   if(this.removeMarkers) {
    //     this.removeMarkers()
    //   }
    // }

    // componentDidUpdate() {
      // let { shouldClearUndoStack, editor } = this.state

    //   if(shouldClearUndoStack) {
    //     setTimeout(function () {
    //       editor.getSession().getUndoManager().reset()
    //     }, 100)
    //   }

    //   console.log('MARK: did update')
    //   this.updateMarkerAnnotations(this.props)
    // }

    componentWillUnmount() {
      document.removeEventListener("click", this.onClick)
    }

  }

  Editor.propTypes = {
    specId: PropTypes.string,
    value: PropTypes.string,
    editorOptions: PropTypes.object,

    onChange: PropTypes.func,
    onMarkerLineUpdate: PropTypes.func,

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
    goToLine: {},
    errors: fromJS([]),
    editorOptions: {},
  }

  return Editor
}
