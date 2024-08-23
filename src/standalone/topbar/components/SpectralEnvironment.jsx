import React from "react"
import PropTypes from "prop-types"

const VALID_OPTIONS = ["DE", "PR"]

function SpectralEnvironment(props) {

    const currentValue = props.currentStateF()
    const onChange = (event) => {
        const value = event.target.value
        props.onChange(value)
    }

    return <div className="spectral-environment-select">
             <label htmlFor="spectral-environment">Spectral Regelset:</label>
             <select id="spectral-environment" name="spectral-environment" onChange={onChange} defaultValue={currentValue}>
               {VALID_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
             </select>
           </div>
}

SpectralEnvironment.propTypes = {
    onChange: PropTypes.func.isRequired,
    currentStateF: PropTypes.func.isRequired
}

export default SpectralEnvironment
