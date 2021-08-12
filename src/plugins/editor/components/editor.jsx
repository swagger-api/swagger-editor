import React from "react"
import PropTypes from "prop-types"
import AceEditor from "react-ace"
import editorPluginsHook from "../editor-plugins/hook"
import { placeMarkerDecorations } from "../editor-helpers/marker-placer"
import Im, { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

import win from "../../../window"

import isUndefined from "lodash/isUndefined"
import omit from "lodash/omit"
import isEqual from "lodash/isEqual"
import debounce from "lodash/debounce"

import ace from "brace"
import "brace/mode/yaml"
import "brace/theme/tomorrow_night_eighties"
import "brace/ext/language_tools"
import "brace/ext/searchbox"
import "./brace-snippets-yaml"

const NOOP = Function.prototype // Apparently the best way to no-op

export default function makeEditor({ editorPluginsToRun }) {

  class Editor extends React.Component {

    constructor(props, context) {
      super(props, context)

      this.editor = null

      this.debouncedOnChange = props.debounce > 0
        ? debounce(props.onChange, props.debounce)
        : props.onChange
    }

    static propTypes = {
      specId: PropTypes.string,
      value: PropTypes.string,
      editorOptions: PropTypes.object,
      origin: PropTypes.string,
      debounce: PropTypes.number,

      onChange: PropTypes.func,
      onMarkerLineUpdate: PropTypes.func,

      markers: PropTypes.object,
      goToLine: PropTypes.object,
      specObject: PropTypes.object.isRequired,

      editorActions: PropTypes.object,

      AST: PropTypes.object.isRequired,

      errors: ImPropTypes.list,
    }

    static defaultProps = {
      value: "",
      specId: "--unknown--",
      origin: "not-editor",
      onChange: NOOP,
      onMarkerLineUpdate: NOOP,
      markers: {},
      goToLine: {},
      errors: fromJS([]),
      editorActions: {onLoad(){}},
      editorOptions: {},
      debounce: 800 // 0.5 imperial seconds™

    }

    checkForSilentOnChange = (value) => {
      if(!this.silent) {
        this.debouncedOnChange(value)
      }
    }

    onLoad = (editor) => {

      const { props } = this
      const { AST, specObject } = props

      const langTools = ace.acequire("ace/ext/language_tools")
      const session = editor.getSession()

      this.editor = editor

      // fixes a warning, see https://github.com/ajaxorg/ace/issues/2499
      editor.$blockScrolling = Infinity


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
      this.syncOptionsFromState(props.editorOptions)
      if(props.editorActions && props.editorActions.onLoad)
        props.editorActions.onLoad({...props, langTools, editor})

      this.updateMarkerAnnotations(this.props)
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
        if(this.getWidth() !== this.width) {
          this.onResize()
          this.width = this.getWidth()
        }
      }, 40)
    }

    getWidth = () => {
      let el = win.document.getElementById("editor-wrapper")
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
      this._removeMarkers = placeMarkerDecorations({
        editor,
        markers,
        onMarkerLineUpdate: props.onMarkerLineUpdate,
      })
    }

    removeMarkers = () => {
      if(this._removeMarkers) {
        this._removeMarkers()
        this._removeMarkers = null
      }
    }

    shouldUpdateYaml = (props) => {
      // No editor instance
      if(!this.editor)
        return false

      // Origin is editor
      if(props.origin === "editor")
        return false

      // Redundant
      if(this.editor.getValue() === props.value)
        return false

      // Value and origin are same, no update.
      if(this.props.value === props.value
        && this.props.origin === props.origin)
        return false

      return true
    }

    shouldUpdateMarkers = (props) => {
      const { markers } = props
      if(Im.Map.isMap(markers)) {
        return !Im.is(markers, this.props.markers) // Different from previous?
      }
      return true // Not going to do a deep compare of object-like markers
    }

    updateYamlAndMarkers = (props) => {
      // If we update the yaml, we need to "lift" the yaml first
      if(this.shouldUpdateYaml(props)) {
        this.removeMarkers()
        this.updateYaml(props)
        this.updateMarkerAnnotations(props)

      } else if (this.shouldUpdateMarkers(props)) {
        this.removeMarkers()
        this.updateMarkerAnnotations(props)
      }
    }

    updateYaml = (props) => {
      if (props.origin === "insert") {
        // Don't clobber the undo stack in this case.
        this.editor.session.doc.setValue(props.value)
        this.editor.selection.clearSelection()
      } else {
        // session.setValue does not trigger onChange, nor add to undo stack.
        // Neither of which we want here.
        this.editor.session.setValue(props.value)
      }
    }

    syncOptionsFromState = (editorOptions={}) => {
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

    componentDidMount() {
      // eslint-disable-next-line react/no-did-mount-set-state

      this.width = this.getWidth()
      win.document.addEventListener("click", this.onClick)
      // add user agent info to document
      // allows our custom Editor styling for IE10 to take effect
      var doc = win.document.documentElement
      doc.setAttribute("data-useragent", win.navigator.userAgent)
      this.syncOptionsFromState(this.props.editorOptions)
    }

    componentWillUnmount() {
      win.document.removeEventListener("click", this.onClick)
    }

    // eslint-disable-next-line react/no-deprecated
    UNSAFE_componentWillReceiveProps(nextProps) {
      let hasChanged = (k) => !isEqual(nextProps[k], this.props[k])
      const editor = this.editor

      // Change the debounce value/func
      if(this.props.debounce !== nextProps.debounce) {
        if(this.debouncedOnChange.flush)
          this.debouncedOnChange.flush()

        this.debouncedOnChange = nextProps.debounce > 0
          ? debounce(nextProps.onChange, nextProps.debounce)
          : nextProps.onChange
      }

      this.updateYamlAndMarkers(nextProps)
      this.updateErrorAnnotations(nextProps)

      if(hasChanged("editorOptions")) {
        this.syncOptionsFromState(nextProps.editorOptions)
      }

      if(editor && nextProps.goToLine && nextProps.goToLine.line && hasChanged("goToLine")) {
        editor.gotoLine(nextProps.goToLine.line)
        nextProps.editorActions.jumpToLine(null)
      }

    }

    shouldComponentUpdate() {
      return false // Never update, see: componentWillRecieveProps and this.updateYaml for where we update things.
    }

    render() {
      // NOTE: we're manually managing the value lifecycle, outside of react render
      // This will only render once.
      return (
        <AceEditor
          mode="yaml"
          theme="tomorrow_night_eighties"
          value={this.props.value /* This will only load once, thereafter it'll be via updateYaml */}
          onLoad={this.onLoad}
          onChange={this.checkForSilentOnChange}
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

  }

  return Editor
}
