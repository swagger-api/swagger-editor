import React from "react"
import PropTypes from "prop-types"

const NewEditorButton = ({ getComponent }) => {
  const Link = getComponent("Link")

  return (
    <Link href="https://editor-next.swagger.io/" className="new-editor-cta" target="_blank">
      <span>Try our new Editor</span>
    </Link>
  )
}

NewEditorButton.propTypes = {
  getComponent: PropTypes.func.isRequired,
}


export default NewEditorButton
