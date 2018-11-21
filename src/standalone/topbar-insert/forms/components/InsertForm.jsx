import React from "react"
import PropTypes from "prop-types"
import { OrderedMap, Map } from "immutable"
import { checkForEmptyValue } from "../helpers/validation-helpers"

const InsertForm = ({ formData, getComponent }) => {
  const InsertFormInput = getComponent("InsertFormInput")
  const formRows = []
  let i = 0

  formData.forEach((v) => {
    if (OrderedMap.isOrderedMap(v) || Map.isMap(v)) {
      // The form field has a prerequisite field that has been filled out.
      const dependsOnNonEmpty = v.has("dependsOn") && !checkForEmptyValue(formData.getIn(v.get("dependsOn")))

      if (dependsOnNonEmpty && v.has("updateOptions")) {
        // There is an action to perform when the prerequisite has been filled out.
        const dependsOnValue = formData.getIn(v.get("dependsOn"))
        const updateOptions = v.get("updateOptions")
        formRows.push(<InsertFormInput formData={v.set("options", updateOptions(dependsOnValue))} index={i} getComponent={getComponent} />)
      } else if (!v.has("dependsOn") || (!v.has("updateOptions") && dependsOnNonEmpty)) {
        // There is no prerequisite or the prerequisite has been filled out and there is no 
        // additional action to take, so simply show the form field.
        formRows.push(<InsertFormInput formData={v} index={i} getComponent={getComponent}/>)
      } 
    }
    i+=1
  })

  return <div> {formRows} </div>
}

InsertForm.propTypes = {
  formData: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default InsertForm