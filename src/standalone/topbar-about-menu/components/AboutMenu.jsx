import React from "react"
import DropdownMenu from "../../topbar/components/DropdownMenu"
import PropTypes from "prop-types"

const AboutMenu = ({ getComponent, ...rest }) => {
  const Link = getComponent("Link")

  return (
    <DropdownMenu {...rest}>
      <li><Link href="https://swagger.io/tools/swagger-editor/" target="_blank">About Swagger Editor</Link></li>
      <li><Link href="https://swagger.io/docs/open-source-tools/swagger-editor/" target="_blank">View Docs</Link></li>
      <li><Link href="https://github.com/swagger-api/swagger-editor" target="_blank">View on GitHub</Link></li>
    </DropdownMenu>
  )
}

AboutMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
}


export default AboutMenu
