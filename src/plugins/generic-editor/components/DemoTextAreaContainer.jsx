import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * This is a demo container of a basic TextArea with a controlled string value
 * So the main thing to track is the object type of spec vs. string type of textarea
 * expect to remove for production
 * */

export default class DemoTextAreaContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const { onChange } = this.props;
    onChange(JSON.parse(e.target.value));
  }

  render() {
    const { valueForDemo } = this.props;

    return (
      <div id="generic-editor-wrapper" className="generic-editor-wrapper">
        <div style={{ border: '2px', borderColor: 'blue' }}>
          <h3>A simple textarea</h3>
          <textarea
            type="textarea"
            name="textAreaValue"
            value={valueForDemo}
            onChange={(e) => this.handleChange(e)}
            cols={60}
          />
        </div>
      </div>
    );
  }
}

DemoTextAreaContainer.propTypes = {
  onChange: PropTypes.func.isRequired,
  valueForDemo: PropTypes.string.isRequired,
};
