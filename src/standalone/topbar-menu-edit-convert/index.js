/* eslint-disable react/prop-types */

import React from "react"

import ConvertDefinitionMenuItem from "./components/convert-definition-menu-item"
import ConvertModal from "./components/convert-modal"

export default {
  components: {
    ConvertDefinitionMenuItem,
    ConvertModal,
  },
  wrapComponents: {
    Topbar: (Ori) => props => {
      const ConvertModal = props.getComponent("ConvertModal")
      return <div>
        <Ori {...props} />
        {props.topbarSelectors.showModal("convert") && <ConvertModal 
          getComponent={props.getComponent}
          editorContent={props.specSelectors.specStr()}
          converterUrl={props.getConfigs().swagger2ConverterUrl}
          updateEditorContent={content => props.specActions.updateSpec(content, "insert")}
          onClose={() => props.topbarActions.hideModal("convert")}
          />}
      </div>
    }
  }
}