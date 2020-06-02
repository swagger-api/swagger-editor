import React, { Component } from "react"
import PropTypes from "prop-types"

class FormInput extends Component {
  constructor(props) {
    super(props)
    this.isNotRequiredAndEmpty = this.isNotRequiredAndEmpty.bind(this)
  }

  isNotRequiredAndEmpty = () => !this.props.inputValue && !this.props.isRequired
  
  render() { 
    return (
      <div>
        {this.props.bigTextBox ? 
          <textarea
            type="text"
            value={this.props.inputValue}
            className={`form-control ${this.props.isValid || this.isNotRequiredAndEmpty() ? "" : "border border-danger"}`} 
            onChange={this.props.onChange}
            placeholder={this.props.placeholderText}
          />:
          <input 
            type="text"
            value={this.props.inputValue}
            className={`form-control ${this.props.isValid || this.isNotRequiredAndEmpty() ? "" : "border border-danger"}`} 
            onChange={this.props.onChange}
            placeholder={this.props.placeholderText}
          />}
        {!this.props.isValid && !this.isNotRequiredAndEmpty() && this.props.validationMessage && 
          <div className="invalid-feedback">
            {this.props.validationMessage}
          </div> 
        }
      </div>
    )
  }
}

FormInput.propTypes = {
  isValid: PropTypes.bool,
  placeholderText: PropTypes.string,
  validationMessage: PropTypes.string,
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  bigTextBox: PropTypes.bool
}

export default FormInput 
