import React, { Component } from "react"
import PropTypes from "prop-types"

import Modal from "./modal/Modal"
import Dropdown from "./dropdown/Dropdown"
import DropdownItem from "./dropdown/DropdownItem"
import AddForm from "./forms/components/AddForm"

import { pathForm, pathObject } from "./forms/FormObjects/pathObject"
import { operationForm, operationObject } from "./forms/FormObjects/operationObject"
import { infoForm, infoObject } from "./forms/FormObjects/infoObject"
import { tagsForm, tagsObject } from "./forms/FormObjects/tagsObject"
import { serversForm, serversObject } from "./forms/FormObjects/serversObject"
import { externalDocumentationForm, externalDocumentationObject } from "./forms/FormObjects/externalDocumentationObject"
import { addOperationTagsForm, addOperationTagsObject } from "./forms/FormObjects/AddOperationTags"

export default class TopbarInsert extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddPathModal: false,
      showAddOperationModal: false,
      showAddInfoModal: false,
      showAddExternalDocsModal: false,
      showAddTagsModal: false,
      showAddServersModal: false,
      showAddOperationTagsModal: false
    }

    this.openModalClick = this.openModalClick.bind(this)
    this.closeModalClick = this.closeModalClick.bind(this)
    this.updatePath = this.updatePath.bind(this)
    this.updateExternalDocs = this.updateExternalDocs.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
    this.getPaths = this.getPaths.bind(this)
    this.updateOperation = this.updateOperation.bind(this)
    this.updateServers = this.updateServers.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.addOperationTags = this.addOperationTags.bind(this)
  }

  openModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: true
    })
  }

  closeModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: false
    })
  }

  updatePath = (formData) => {
    const pathFormObject = pathObject(formData)
    this.props.specActions.addToSpec(["paths"], pathFormObject.value, pathFormObject.key)
  }

  updateExternalDocs = (formData) => {
    this.props.specActions.addToSpec([], externalDocumentationObject(formData), "externalDocs")
  }

  updateInfo = (formData) => {
    this.props.specActions.addToSpec([], infoObject(formData), "info")
  } 

  getPaths = () => this.props.specSelectors.paths() ? Object.keys(this.props.specSelectors.paths().toJS()) : null;

  
  addOperationTags(formData) {
    const operationTagsObject = addOperationTagsObject(formData)
    this.props.specActions.addToSpec(operationTagsObject.selectedOperation, operationTagsObject.tags, "tags")
  }

  getOperations = (paths) => {
    const operations = paths ? 
      this.props.specSelectors.operations(paths).toJS() :
      null

    if (!operations) {
      return null
    }
    const methods = []

    operations.forEach(item => methods.push(item.method))

    return methods
  };

  updateOperation = (formData) => {
    const path = formData.getIn(["path", "value"])

    if (!this.getPaths().includes(path)) {
      // Update json in the Swagger UI state with the new path.
      this.props.specActions.addToSpec(["paths"], null, path)
    }

    this.props.specActions.addToSpec(["paths", path], operationObject(formData), formData.getIn(["operation", "value"]))
  }

  updateServers = (formData) => {
    this.props.specActions.addToSpec([], serversObject(formData), "servers")
  }

  updateTags = (formData) => {
    this.props.specActions.addToSpec([], tagsObject(formData), "tags")
  }

  render() {
    if (!this.props.specSelectors.isOAS3()) {
      return null
    }

    return (
      <div>
        {this.state.showAddPathModal &&
          <Modal
            title="Add Path"
            onCloseClick={this.closeModalClick("showAddPathModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddPathModal")} 
              submitButtonText="Add Path" 
              getFormData={pathForm} 
              updateSpecJson={this.updatePath} 
            />
          </Modal>
        }
        { this.state.showAddOperationModal && 
        <Modal
          title="Add Operation to Document"
          onCloseClick={this.closeModalClick("showAddOperationModal")}
        >
          <AddForm 
            {...this.props} 
            submit={this.closeModalClick("showAddOperationModal")} 
            submitButtonText="Add Operation"
            getFormData={operationForm}
            updateSpecJson={this.updateOperation}
            existingData={this.getPaths()}
          />
        </Modal>
        }
        { this.state.showAddInfoModal &&
          <Modal
            title="Add Info to Document"
            onCloseClick={this.closeModalClick("showAddInfoModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddInfoModal")} 
              submitButtonText="Add Info"
              getFormData={infoForm}
              updateSpecJson={this.updateInfo}
              existingData={this.props.specSelectors.info()}
            />
          </Modal>
        }
        { this.state.showAddExternalDocsModal &&
          <Modal
            title="Add External Documentation"
            onCloseClick={this.closeModalClick("showAddExternalDocsModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddExternalDocsModal")} 
              submitButtonText="Add External Documentation"
              getFormData={externalDocumentationForm}
              updateSpecJson={this.updateExternalDocs}
            />
          </Modal>
        }
        { this.state.showAddTagsModal &&
          <Modal
            title="Add Tag Declarations"
            onCloseClick={this.closeModalClick("showAddTagsModal")}
          >
            <AddForm
              {...this.props} 
              submit={this.closeModalClick("showAddTagsModal")} 
              submitButtonText="Add Tag Declarations"
              getFormData={tagsForm}
              updateSpecJson={this.updateTags}
            />
          </Modal>
        }
        { this.state.showAddServersModal &&
          <Modal
            title="Add Servers"
            onCloseClick={this.closeModalClick("showAddServersModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddServersModal")} 
              submitButtonText="Add Servers"
              getFormData={serversForm}
              updateSpecJson={this.updateServers}            
            />
          </Modal>
        }
        
        { this.state.showAddOperationTagsModal && 
          <Modal
            title="Add Tags To Operation"
            onCloseClick={this.closeModalClick("showAddOperationTagsModal")}
            isShown
            isLarge
          >
            <AddForm
              {...this.props}
              submit={this.closeModalClick("showAddOperationTagsModal")}
              getFormData={addOperationTagsForm}
              existingData={{ getPaths: this.getPaths, getOperations: this.getOperations }}
              submitButtonText="Add Tags To Operation"
              updateSpecJson={this.addOperationTags}
            />
          </Modal>
        }

        <Dropdown displayName="Insert" >
          <DropdownItem onClick={this.openModalClick("showAddPathModal")} name="Add Path Item"/>    
          <DropdownItem onClick={this.openModalClick("showAddOperationModal")} name="Add Operation" />
          <DropdownItem onClick={this.openModalClick("showAddInfoModal")} name="Add Info" />
          <DropdownItem onClick={this.openModalClick("showAddExternalDocsModal")} name="Add External Documentation" />
          <DropdownItem onClick={this.openModalClick("showAddTagsModal")} name="Add Tag Declarations" />
          <DropdownItem onClick={this.openModalClick("showAddOperationTagsModal")} name="Add Tags To Operation" />
          <DropdownItem onClick={this.openModalClick("showAddServersModal")} name="Add Servers" />
        </Dropdown>
      </div>
    )
  }
}

TopbarInsert.propTypes = {
  specSelectors: PropTypes.shape({
    specStr: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    paths: PropTypes.func.isRequired,
    isOAS3: PropTypes.func.isRequired,
    operations: PropTypes.func.isRequired
  }),
  errSelectors: PropTypes.shape({
    allErrors: PropTypes.func.isRequired
  }),
  specActions: PropTypes.shape({
    addToSpec: PropTypes.func.isRequired
  })
}
