import React from "react"
import PropTypes from "prop-types"

const VALID_OPTIONS = ["v5", "v10"]

function SpectralVersion(props) {

    const currentValue = props.currentStateF()
    const onChange = (event) => {
        const value = event.target.value
        props.onChange(value)
    }
    
    return <div className="spectral-version-select">
             <label htmlFor="spectral-version">Spectral Regelset:</label>
             <select id="spectral-version" name="spectral-version" onChange={onChange} defaultValue={currentValue}>             
               {VALID_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
             </select>
           </div>
}

SpectralVersion.propTypes = {
    onChange: PropTypes.func.isRequired,
    currentStateF: PropTypes.func.isRequired
}

export default SpectralVersion
