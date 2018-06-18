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

    this.UpdateToBeAdded = this.UpdateToBeAdded.bind(this)
    this.ShowAddField = this.ShowAddField.bind(this)
    this.OnEnterKeyPress = this.OnEnterKeyPress.bind(this)
    this.SubmitAdded = this.SubmitAdded.bind(this)
    this.OnChangeWrapper = this.OnChangeWrapper.bind(this)
  }

  OnEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      this.SubmitAdded()
    }
  }

  SubmitAdded = () => {
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

  UpdateToBeAdded = (event) => {
    this.setState({
      toBeAdded: event.target.value,
      isValidAddition: this.props.isValidAddition(event.target.value)
    })

    this.props.onChange(event)
  }

  ShowAddField = () => {
    this.setState({
      showAddOption: true
    })

    if (this.state.toBeAdded !== "") {
      this.SubmitAdded()
    }
  }

  OnChangeWrapper = (event) => {
    if (event.target.value === "Please Select" || event.target.value === this.props.placeholderText) {
      const updated = event
      updated.target.value = null
      this.props.onChange(updated)
    }

    this.props.onChange(event)
  }

  render() { 
    let addedOption = <span />
    const addButton = <a role="button" className="d-inline-block float-right" onClick={this.ShowAddField} onKeyDown={this.OnEnterKeyPress} tabIndex={0}>Add</a>
    if (this.props.isValidAddition) {
      if (this.state.showAddOption) {
        addedOption = ( 
          <div>
            <input 
              className="form-control" 
              type="text"
              onChange={this.UpdateToBeAdded} 
              value={this.state.toBeAdded} 
              placeholder="Add Option" 
              onKeyDown={this.AddField} 
            />
            { addButton }
            { !this.state.isValidAddition && this.props.isValidAdditionationMessage && <div className="invalid-feedback">{this.props.isValidAdditionationMessage}</div> }
          </div>)
      } else {
        addedOption = addButton
      }
    }
    
    return (
      <div>
        { !this.state.showAddOption &&
          <select 
            value={this.props.selected} 
            onChange={this.OnChangeWrapper}
            className= {classNames("custom-select", {"border-danger": !this.props.isValid}) } 
          >
            <option value={null} selected> 
              {this.props.placeholderText || "Please Select"} 
            </option>
            { this.props.options.map((option, i) => 
              <option key={option + i} value={option}>{option}</option>)}
            { this.state.addedOptions.length && 
              this.state.addedOptions.map((option, i) =>
                <option key={option + i} value={option}>{option}</option>)
            }
          </select>
        }
      
        { addedOption }
        { !this.props.isValid && 
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
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  isValidAddition: PropTypes.func,
  isValidAdditionationMessage: PropTypes.string
}

export default FormDropdown 
