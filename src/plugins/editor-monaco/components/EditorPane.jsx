import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

class EditorPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: '90vh',
      width: '50',
    };
  }

  handleEditorResize = (width) => {
    this.setState({ width });
  };

  render() {
    const { height, width } = this.state;
    const { getComponent } = this.props;

    const ValidationPane = getComponent('ValidationPane', true);
    const ThemeSelection = getComponent('ThemeSelection', true);
    const ReadOnlySelection = getComponent('ReadOnlySelection', true);
    const MonacoEditor = getComponent('MonacoEditor', true);

    return (
      <div className="editor-pane">
        <ValidationPane />
        <ThemeSelection />
        <ReadOnlySelection />
        <ReactResizeDetector
          handleWidth
          handleHeight={false}
          onResize={this.handleEditorResize}
          refreshMode="debounce"
          refreshRate={100}
        />
        <MonacoEditor width={width} height={height} />
      </div>
    );
  }
}

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
