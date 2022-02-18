import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { useDropzone } from "react-dropzone"

const Dropzone = ({ children, onDrop }) => {
  const handleDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0
    const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1

    if (someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
      alert("Sorry, there was an error processing your file.\nPlease drag and drop exactly one .yaml or .json OpenAPI definition file.")
    } else {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const spec = reader.result
        onDrop(spec, "fileDrop")
      }
      reader.readAsText(file, "utf-8")
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: handleDrop,
    accept: ".yaml,application/json",
    multiple: false,
    noClick: true,
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive
        ? (
          <div className="dropzone__overlay">
            Please drop a .yaml or .json OpenAPI spec.
          </div>
        )
        : children
      }
    </div>
  )
}
Dropzone.propTypes = {
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
}

const EditorLayout = ({ specActions, getComponent }) => {
  const UIBaseLayout = getComponent("BaseLayout", true)
  const EditorContainer = getComponent("EditorContainer", true)
  const SplitPaneMode = getComponent("SplitPaneMode", true)
  const Container = getComponent("Container")

  const handleChange = (newYaml, origin="editor") => {
    specActions.updateSpec(newYaml, origin)
  }

  return (
    <div className="swagger-editor">
      <Container className="container">
        <Dropzone onDrop={handleChange}>
          <SplitPaneMode>
            <EditorContainer onChange={handleChange} />
            <UIBaseLayout/>
          </SplitPaneMode>
        </Dropzone>
      </Container>
    </div>
  )
}
EditorLayout.propTypes = {
  errSelectors: PropTypes.object.isRequired,
  errActions: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  layoutActions: PropTypes.object.isRequired
}

export default EditorLayout
