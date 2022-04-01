import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

class EditorPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: '91.5vh',
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
        <div className="swagger-ide__editor-pane-container-col">
          <EditorPaneBarTop />
          <div className="swagger-ide__editor-pane-container-row">
            <ReactResizeDetector
              handleWidth
              handleHeight={false}
              onResize={this.handleEditorResize}
              refreshMode="debounce"
              refreshRate={100}
            />
            <Editor width={width} height={height} />
          </div>
        </div>
      </div>
    );
  }
}

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
