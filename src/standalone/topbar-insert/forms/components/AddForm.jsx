import React, { Component } from "react"
import PropTypes from "prop-types"
import YAML from "js-yaml"
import { getForm } from "./../helpers/form-data-helpers"
import { checkForErrors } from "./../helpers/validation-helpers"

class AddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formErrors: false,
      formData: this.props.existingData ? 
        this.props.getFormData( (newForm, path) => this.UpdateForm(newForm, path), [], this.props.existingData) :
        this.props.getFormData( (newForm, path) => this.UpdateForm(newForm, path), [] )
    }

    this.UpdateForm = this.UpdateForm.bind(this)
    this.Submit = this.Submit.bind(this)
  }

  Submit = function () {
    const formData = this.state.formData

    // Prevent form submission if the data was invalid.
    if (checkForErrors(formData)[1]) {
      this.setState(prevState => ({
        formErrors: true,
        formData: checkForErrors(prevState.formData)[0]
      }))

      return
    }

    this.setState({
      formErrors: false
    })

    // Update the Swagger UI state.
    this.props.updateSpecJson(formData)

    // Update the spec string in the Swagger UI state with the new json.
    const currentJson = this.props.specSelectors.specJson()
    this.props.specActions.updateSpec(YAML.safeDump(currentJson.toJS()))

    // Perform any parent component actions for the form.
    this.props.submit()
  }

  UpdateForm(newFormData, path) {
    this.setState(prevState => ({ 
      formData: prevState.formData.setIn(path, newFormData) 
    }))
  }

  render() {
    return (
      <div>
        <div className="modal-body">
          <div className="form-container">
            { getForm(this.state.formData) }
          </div> 
        </div>
        <div className="modal-footer">
          { this.state.formErrors && <div className="invalid-feedback">Please fix errors before submitting.</div>}
          <button className="btn btn-default" onClick={this.Submit}>{this.props.submitButtonText}</button>
        </div>
      </div>
    )
  } 
}

AddForm.propTypes = {
  specActions: PropTypes.shape({
    updateSpec: PropTypes.func.isRequired
  }),
  specSelectors: PropTypes.shape({
    specStr: PropTypes.func.isRequired,
    specJson: PropTypes.func.isRequired
  }),
  submit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  getFormData: PropTypes.func.isRequired,
  updateSpecJson: PropTypes.func.isRequired,
  existingData: PropTypes.object
}

export default AddForm
