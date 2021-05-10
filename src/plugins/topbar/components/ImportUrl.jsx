/* eslint-disable jsx-a11y/label-has-associated-control */
// todo (when extract modal to component): https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ImportUrl extends PureComponent {
  render() {
    const { onImportUrlChange } = this.props;
    return (
      <div className="input-group">
        <label>Enter the URL to import from</label>
        <input
          type="text"
          className="form-control"
          placeholder="type url here"
          onChange={onImportUrlChange}
        />
      </div>
    );
  }
}

ImportUrl.propTypes = {
  onImportUrlChange: PropTypes.func.isRequired,
};
