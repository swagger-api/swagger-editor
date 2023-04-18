import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ConvertModal extends Component {
  constructor() {
    super()
    this.state = {
      error: null,
      status: "new"
    }
  }
  convertDefinition = async (converterUrl) => {
    this.setState({ status: "converting" })

    try {
      const conversionResult = await this.performConversion(converterUrl)
      this.setState({
        status: "success",
      })
      this.props.updateEditorContent(conversionResult)
    } catch (e) {
      this.setState({
        error: e,
        status: "errored",
      })
    }
  }

  performConversion = async (converterUrl) => {
    const res = await fetch(converterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/yaml",
        "Accept": "application/yaml",
      },
      body: this.props.editorContent
    })

    const body = await res.text()

    if (!res.ok) {
      throw new Error(body)
    }

    return body
  }

  render() {
    const { onClose, getComponent, converterUrl } = this.props

    if (this.state.status === "new") {
      return <ConvertModalStepNew
        onClose={onClose}
        onContinue={() => this.convertDefinition(converterUrl)}
        getComponent={getComponent}
        converterUrl={converterUrl}
      />
    }

    if (this.state.status === "converting") {
      return <ConvertModalStepConverting
        getComponent={getComponent}
      />
    }

    if (this.state.status === "success") {
      return <ConvertModalStepSuccess
        onClose={onClose}
        getComponent={getComponent}
      />
    }

    if (this.state.status === "errored") {
      return <ConvertModalStepErrored
        onClose={onClose}
        error={this.state.error}
        getComponent={getComponent}
      />
    }


    return null
  }
}

ConvertModal.propTypes = {
  editorContent: PropTypes.string.isRequired,
  converterUrl: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  updateEditorContent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ConvertModalStepNew = ({ getComponent, onClose, onContinue, converterUrl }) => {
  const Modal = getComponent("TopbarModal")

  return <Modal className="modal" styleName="modal-dialog-sm" onCloseClick={onClose}>
    <div className="container modal-message">
      <h2>Convert to OpenAPI 3</h2>
      <p>
        This feature uses the Swagger Converter API to convert your Swagger 2.0
        definition to OpenAPI 3.
      </p>
      <p>
        Swagger Editor&apos;s contents will be sent to <b><code>{converterUrl}</code></b> and overwritten
        by the conversion result.
      </p>
    </div>
    <div className="right">
      <button className="btn cancel" onClick={onClose}>Cancel</button>
      <button className="btn" onClick={onContinue}>Convert</button>
    </div>
  </Modal>
}

ConvertModalStepNew.propTypes = {
  getComponent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  converterUrl: PropTypes.string.isRequired,
}

const ConvertModalStepConverting = ({ getComponent }) => {
  const Modal = getComponent("TopbarModal")

  return <Modal className="modal" styleName="modal-dialog-sm" hideCloseButton={true}>
    <div className="container modal-message">
      <h2>Converting...</h2>
      <p>
        Please wait.
      </p>
    </div>
  </Modal>
}

ConvertModalStepConverting.propTypes = {
  getComponent: PropTypes.func.isRequired,
}

const ConvertModalStepSuccess = ({ getComponent, onClose }) => {
  const Modal = getComponent("TopbarModal")

  return <Modal className="modal" styleName="modal-dialog-sm" onCloseClick={onClose}>
    <div className="container modal-message">
      <h2>Conversion complete</h2>
      <p>
        Your definition was successfully converted to OpenAPI 3!
      </p>
    </div>
    <div className="right">
      <button className="btn" onClick={onClose}>Close</button>
    </div>
  </Modal>
}


ConvertModalStepSuccess.propTypes = {
  getComponent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

const ConvertModalStepErrored = ({ getComponent, onClose, error }) => {
  const Modal = getComponent("TopbarModal")

  return <Modal className="modal" styleName="modal-dialog-sm" onCloseClick={onClose}>
    <div className="container modal-message">
      <h2>Conversion failed</h2>
      <p>
        The converter service was unable to convert your definition.
      </p>
      <p>
        Here&apos;s what the service told us:
      </p>
      <code>
        {error.toString()}
      </code>
    </div>
    <div className="right">
      <button className="btn" onClick={onClose}>Close</button>
    </div>
  </Modal>
}

ConvertModalStepErrored.propTypes = {
  getComponent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.any.isRequired,
}
