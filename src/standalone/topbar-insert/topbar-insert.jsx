import React, { Component } from "react"
import PropTypes from "prop-types"

import Modal from "./modal/Modal"
import Dropdown from "./dropdown/Dropdown"
import DropdownItem from "./dropdown/DropdownItem"
import AddForm from "./forms/components/AddForm"

import { PathForm, PathObject } from "./forms/FormObjects/PathObject"
import { OperationForm, OperationObject } from "./forms/FormObjects/OperationObject"
import { InfoForm, InfoObject } from "./forms/FormObjects/InfoObject"
import { TagsForm, TagsObject } from "./forms/FormObjects/TagsObject"
import { ServersForm, ServersObject } from "./forms/FormObjects/ServersObject"
import { ExternalDocumentationForm, ExternalDocumentationObject } from "./forms/FormObjects/ExternalDocumentationObject"

export default class TopbarInsert extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddPathModal: false,
      showAddOperationModal: false,
      showAddInfoModal: false,
      showAddExternalDocsModal: false,
      showAddTagsModal: false,
      showAddServersModal: false
    }

    this.OpenModalClick = this.OpenModalClick.bind(this)
    this.CloseModalClick = this.CloseModalClick.bind(this)
    this.UpdatePath = this.UpdatePath.bind(this)
    this.UpdateExternalDocs = this.UpdateExternalDocs.bind(this)
    this.UpdateInfo = this.UpdateInfo.bind(this)
    this.GetPaths = this.GetPaths.bind(this)
    this.UpdateOperation = this.UpdateOperation.bind(this)
    this.UpdateServers = this.UpdateServers.bind(this)
    this.UpdateTags = this.UpdateTags.bind(this)
  }

  OpenModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: true
    })
  }

  CloseModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: false
    })
  }

  UpdatePath = (formData) => {
    const pathObject = PathObject(formData)
    this.props.specActions.addToSpec(["paths"], pathObject.value, pathObject.key)
  }

  UpdateExternalDocs = (formData) => {
    this.props.specActions.addToSpec([], ExternalDocumentationObject(formData), "externalDocs")
  }

  UpdateInfo = (formData) => {
    this.props.specActions.addToSpec([], InfoObject(formData), "info")
  } 

  GetPaths = () => this.props.specSelectors.paths() ? Object.keys(this.props.specSelectors.paths().toJS()) : null;

  UpdateOperation = (formData) => {
    const path = formData.getIn(["path", "value"])

    if (!this.GetPaths().includes(path)) {
      // Update json in the Swagger UI state with the new path.
      this.props.specActions.addToSpec(["paths"], null, path)
    }

    this.props.specActions.addToSpec(["paths", path], OperationObject(formData), formData.getIn(["operation", "value"]))
  }

  UpdateServers = (formData) => {
    this.props.specActions.addToSpec([], ServersObject(formData), "servers")
  }

  UpdateTags = (formData) => {
    this.props.specActions.addToSpec([], TagsObject(formData), "tags")
  }

  render() {
    if (!this.props.specSelectors.isOAS3()) {
      return <span />
    }

    return (
      <div>
        {this.state.showAddPathModal &&
          <Modal
            title="Add Path"
            onCloseClick={this.CloseModalClick("showAddPathModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.CloseModalClick("showAddPathModal")} 
              submitButtonText="Add Path" 
              getFormData={PathForm} 
              updateSpecJson={this.UpdatePath} 
            />
          </Modal>
        }
        { this.state.showAddOperationModal && 
        <Modal
          title="Add Operation to Document"
          onCloseClick={this.CloseModalClick("showAddOperationModal")}
        >
          <AddForm 
            {...this.props} 
            submit={this.CloseModalClick("showAddOperationModal")} 
            submitButtonText="Add Operation"
            getFormData={OperationForm}
            updateSpecJson={this.UpdateOperation}
            existingData={this.GetPaths()}
          />
        </Modal>
        }
        { this.state.showAddInfoModal &&
          <Modal
            title="Add Info to Document"
            onCloseClick={this.CloseModalClick("showAddInfoModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.CloseModalClick("showAddInfoModal")} 
              submitButtonText="Add Info"
              getFormData={InfoForm}
              updateSpecJson={this.UpdateInfo}
              existingData={this.props.specSelectors.info()}
            />
          </Modal>
        }
        { this.state.showAddExternalDocsModal &&
          <Modal
            title="Add External Documentation"
            onCloseClick={this.CloseModalClick("showAddExternalDocsModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.CloseModalClick("showAddExternalDocsModal")} 
              submitButtonText="Add External Documentation"
              getFormData={ExternalDocumentationForm}
              updateSpecJson={this.UpdateExternalDocs}
            />
          </Modal>
        }
        { this.state.showAddTagsModal &&
          <Modal
            title="Add Tags"
            onCloseClick={this.CloseModalClick("showAddTagsModal")}
          >
            <AddForm
              {...this.props} 
              submit={this.CloseModalClick("showAddTagsModal")} 
              submitButtonText="Add Tags"
              getFormData={TagsForm}
              updateSpecJson={this.UpdateTags}
            />
          </Modal>
        }
        { this.state.showAddServersModal &&
          <Modal
            title="Add Servers"
            onCloseClick={this.CloseModalClick("showAddServersModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.CloseModalClick("showAddServersModal")} 
              submitButtonText="Add Servers"
              getFormData={ServersForm}
              updateSpecJson={this.UpdateServers}            
            />
          </Modal>
        }
        
        <Dropdown displayName="Insert" >
          <DropdownItem onClick={this.OpenModalClick("showAddPathModal")} name="Add Path Item"/>    
          <DropdownItem onClick={this.OpenModalClick("showAddOperationModal")} name="Add Operation" />
          <DropdownItem onClick={this.OpenModalClick("showAddInfoModal")} name="Add Info" />
          <DropdownItem onClick={this.OpenModalClick("showAddExternalDocsModal")} name="Add External Documentation" />
          <DropdownItem onClick={this.OpenModalClick("showAddTagsModal")} name="Add Tags" />
          <DropdownItem onClick={this.OpenModalClick("showAddServersModal")} name="Add Servers" />
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
    isOAS3: PropTypes.func.isRequired
  }),
  errSelectors: PropTypes.shape({
    allErrors: PropTypes.func.isRequired
  }),
  specActions: PropTypes.shape({
    addToSpec: PropTypes.func.isRequired
  })
}
