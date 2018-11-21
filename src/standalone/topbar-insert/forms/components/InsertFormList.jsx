import React from "react"
import PropTypes from "prop-types"
import { OrderedMap, Map, List } from "immutable"
import { removeFormItem } from "../helpers/form-data-helpers"

const InsertFormList = ({ parent, formData, getComponent }) => 
{
  const InsertForm = getComponent("InsertForm")
  const InsertFormInput = getComponent("InsertFormInput")

  if (!List.isList(formData)) {
    return (<div> An error occurred while loading the form.</div>)
  }

  const jsx = []

  formData.forEach((item, index) => {
    const showClose = index === formData.count() - 1
    const close = (
      <span type="button" className="close remove-item pull-right" aria-label="remove" onClick={() => removeFormItem(parent)}>
        <span aria-hidden="true">&times;</span>
      </span>
    )

    jsx.push((
      <div className="card-body" key={`index-${index}`}>
        {showClose && close}
        {((OrderedMap.isOrderedMap(item) || Map.isMap(item)) && item.has("value")) ?
          <InsertFormInput formData={item} index={index} getComponent={getComponent} /> : 
          <InsertForm formData={item} getComponent={getComponent} />
        }
      </div>
    ))   
  })

  return <div> {jsx} </div>
}

InsertFormList.propTypes = {
  formData: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  parent: PropTypes.object
}

export default InsertFormList