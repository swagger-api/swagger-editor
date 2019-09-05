import React from "react"
import PropTypes from "prop-types"
import Dropzone from "react-dropzone"

Dropzone.displayName = "Dropzone" // For testing

export default class EditorLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired
  }

  onChange = (newYaml, origin="editor") => {
    this.props.specActions.updateSpec(newYaml, origin)
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0
    const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1
    if ( someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
      alert("Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
    } else {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const spec = reader.result
        this.onChange(spec, "fileDrop")
      }

      reader.readAsText(file, "utf-8")
    }
  }

  render() {
    const { getComponent } = this.props

    const UIBaseLayout = getComponent("BaseLayout", true)
    const EditorContainer = getComponent("EditorContainer", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)

    const Container = getComponent("Container")

    return (
      <div className="swagger-editor">
        <Container className="container">
          <Dropzone
            className="dropzone"
            accept=".yaml,application/json"
            multiple={false}
            onDrop={this.onDrop}
            disablePreview
            disableClick
          >
          {({ isDragActive }) => {
            if (isDragActive) {
              return (
                <div className="dropzone__overlay">
                  Please drop a .yaml or .json OpenAPI spec.
                </div>
              )
            } else {
              return (
                <SplitPaneMode>
                  <EditorContainer onChange={this.onChange} />
                  <UIBaseLayout/>
                </SplitPaneMode>
              )
            }
          }}
          </Dropzone>
        </Container>
      </div>
    )
  }
}
