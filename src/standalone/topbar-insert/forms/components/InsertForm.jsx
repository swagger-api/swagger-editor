import React from "react"
import PropTypes from "prop-types"
import { OrderedMap, Map } from "immutable"
import { checkForEmptyValue } from "../helpers/validation-helpers"

const InsertForm = ({ formData, getComponent }) => {
  const InsertFormInput = getComponent("InsertFormInput")
  const formRows = []
  
  formData.forEach((v, i) => {
    if (OrderedMap.isOrderedMap(v) || Map.isMap(v)) {
      // The form field has a prerequisite field that has been filled out.
      const dependsOnNonEmpty = v.has("dependsOn") && (!checkForEmptyValue(formData.getIn(v.get("dependsOn"))) || v.get("dependsOn") === "formData")

      if (dependsOnNonEmpty && v.has("updateOptions") && v.has("options")) {
        // There is an action to perform when the prerequisite has been filled out to update
        // the options in the dropdown.
        const dependsOnValue = formData.getIn(v.get("dependsOn"))
        const updateOptions = v.get("updateOptions")

        formRows.push(<InsertFormInput formData={v.set("options", updateOptions(dependsOnValue, formData))} index={i} getComponent={getComponent} key={i} />)
      } else if (!v.has("dependsOn") || (!(v.has("updateOptions") && v.has("options")) && dependsOnNonEmpty )) {
        // There is no prerequisite or the prerequisite has been filled out and there is no 
        // additional action to take, so simply show the form field.
        formRows.push(<InsertFormInput formData={v} index={i} getComponent={getComponent} key={i} />)
      } 
    }
  })

  return <div> {formRows} </div>
}

InsertForm.propTypes = {
  formData: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default InsertForm