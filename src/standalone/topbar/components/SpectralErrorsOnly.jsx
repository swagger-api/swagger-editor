import React from 'react';

function SpectralErrorsOnly(props) {
  const currentValue = props.currentStateF()
  const onChange = (event) => {
    const value = event.target.value
    props.onChange(value)
  }
  return (
    <label>
      Spectral Errors Only
      <input
        type="checkbox"
        onChange={onChange} checked={currentValue}
      />
    </label>
  );
}

export default SpectralErrorsOnly;
