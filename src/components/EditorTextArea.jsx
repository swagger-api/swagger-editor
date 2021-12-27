import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * This is a provided default component that is generally
 * expected to be overwritten via wrapComponentt
 */

export default class EditorTextArea extends PureComponent {
  getSelectorSpecStr = () => {
    const { specSelectors } = this.props;
    const initialValue = '';
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  handleChangeEditorValue = (val) => {
    const { specActions } = this.props;
    // update swagger-ui state.spec
    specActions.updateSpec(val);
  };

  handleChange = (e) => {
    e.preventDefault();
    // known issue: should catch and translate keycode for keyboard input 'return'
    this.handleChangeEditorValue(JSON.parse(e.target.value));
  };

  render() {
    const valueForDemo = JSON.stringify(this.getSelectorSpecStr());

    return (
      <div>
        <div id="editor-workspace-wrapper" className="editor-workspace-wrapper">
          <div style={{ border: '2px', borderColor: 'blue' }}>
            <h3>A simple textarea</h3>
            <textarea
              type="textarea"
              name="textAreaValue"
              value={valueForDemo}
              onChange={(e) => this.handleChange(e)}
              cols={60}
              rows={30}
            />
          </div>
        </div>
      </div>
    );
  }
}

EditorTextArea.propTypes = {
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
