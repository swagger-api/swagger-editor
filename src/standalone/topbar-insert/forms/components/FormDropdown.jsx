import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

class FormDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addedOptions: [],
      toBeAdded: "",
      showAddOption: false,
      isValidAddition: true
    }

    this.updateToBeAdded = this.updateToBeAdded.bind(this)
    this.showAddField = this.showAddField.bind(this)
    this.onEnterKeyPress = this.onEnterKeyPress.bind(this)
    this.submitAdded = this.submitAdded.bind(this)
    this.onChangeWrapper = this.onChangeWrapper.bind(this)
  }

  onEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      this.submitAdded()
    }
  }

  submitAdded = () => {
    if (this.props.isValidAddition(this.state.toBeAdded)) {
      this.setState((prevState) => {
        prevState.addedOptions.push(prevState.toBeAdded)
        return {
          addedOptions: prevState.addedOptions,
          toBeAdded: "",
          showAddOption: false
        }
      })
    } else {
      this.setState({
        isValidAddition: false
      })
    }
  }

  updateToBeAdded = (event) => {
    this.setState({
      toBeAdded: event.target.value,
      isValidAddition: this.props.isValidAddition(event.target.value)
    })

    this.props.onChange(event)
  }

  showAddField = () => {
    this.setState({
      showAddOption: true
    })

    if (this.state.toBeAdded) {
      this.submitAdded()
    }
  }

  onChangeWrapper = (event) => {
    if (event.target.value === "Please Select" || event.target.value === this.props.placeholderText) {
      const updated = event
      updated.target.value = null
      this.props.onChange(updated)
    }

    this.props.onChange(event)
  }

  render() { 
    let addedOption = <span />
    const addButton = <a role="button" className="d-inline-block float-right" onClick={this.showAddField} onKeyDown={this.onEnterKeyPress} tabIndex={0}>Add</a>
    if (this.props.isValidAddition) {
      if (this.state.showAddOption) {
        addedOption = ( 
          <div>
            <input 
              className="form-control" 
              type="text"
              onChange={this.updateToBeAdded} 
              value={this.state.toBeAdded} 
              placeholder="Add Option" 
              onKeyDown={this.addField} 
            />
            {addButton}
            {!this.state.isValidAddition &&
              this.props.isValidAdditionMessage && 
              <div className="invalid-feedback">
                {this.props.isValidAdditionMessage}
              </div>
            }
          </div>)
      } else {
        addedOption = addButton
      }
    }
    
    return (
      <div>
        {!this.state.showAddOption &&
          <select 
            value={this.props.selected || this.props.placeholderText || "Please Select"} 
            onChange={this.onChangeWrapper}
            className={classNames("custom-select", {"border-danger": !this.props.isValid})} 
          >
            <option value={this.props.placeholderText || "Please Select"}>
              {this.props.placeholderText || "Please Select"}
            </option>
            {(this.props.options || []).map((option, i) => 
              <option key={option + i} value={option}>{option}</option>)}
            {this.state.addedOptions.length && 
              this.state.addedOptions.map((option, i) =>
                <option key={option + i} value={option}>{option}</option>)
            }
          </select>
        }
        {addedOption}
        {!this.props.isValid && 
          <div className="invalid-feedback d-block">
            {this.props.validationMessage}
          </div> 
        }
      </div>
    )
  }
}

FormDropdown.propTypes = {
  isValid: PropTypes.bool.isRequired,
  placeholderText: PropTypes.string,
  validationMessage: PropTypes.string,
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object 
  ]),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  isValidAddition: PropTypes.func,
  isValidAdditionMessage: PropTypes.string
}

export default FormDropdown 
