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

    const EditorPaneBarTop = getComponent('EditorPaneBarTop', true);
    const Editor = getComponent('Editor', true);

    return (
      <div className="swagger-ide__editor-pane">
        <ReactResizeDetector
          handleWidth
          handleHeight={false}
          onResize={this.handleEditorResize}
          refreshMode="debounce"
          refreshRate={100}
        />
        <EditorPaneBarTop />
        <Editor width={width} height={height} />
      </div>
    );
  }
}

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
