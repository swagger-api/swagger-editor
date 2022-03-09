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

    const EditorPaneTopBar = getComponent('EditorPaneTopBar', true);
    const MonacoEditor = getComponent('MonacoEditor', true);

    return (
      <div className="editor-pane">
        <ReactResizeDetector
          handleWidth
          handleHeight={false}
          onResize={this.handleEditorResize}
          refreshMode="debounce"
          refreshRate={100}
        />
        <EditorPaneTopBar getComponent={getComponent} />
        <MonacoEditor width={width} height={height} />
      </div>
    );
  }
}

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
