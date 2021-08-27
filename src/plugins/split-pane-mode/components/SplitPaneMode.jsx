import React from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';

const MODE_KEY = ['split-pane-mode'];
const MODE_LEFT = 'left';
const MODE_RIGHT = 'right';
const MODE_BOTH = 'both'; // or anything other than left/right

export default class SplitPaneMode extends React.Component {
  initializeComponent = (c) => {
    this.splitPane = c;
  };

  handleDragFinished = () => {
    const { threshold, layoutActions } = this.props;
    const { position, draggedSize } = this.splitPane.state;
    this.draggedSize = draggedSize;

    const nearLeftEdge = position <= threshold;
    const nearRightEdge = draggedSize <= threshold;

    layoutActions.changeMode(
      MODE_KEY,
      // eslint-disable-next-line no-nested-ternary
      nearLeftEdge ? MODE_RIGHT : nearRightEdge ? MODE_LEFT : MODE_BOTH
    );
  };

  sizeFromMode = (mode, defaultSize) => {
    if (mode === MODE_LEFT) {
      this.draggedSize = null;
      return '0px';
    }
    if (mode === MODE_RIGHT) {
      this.draggedSize = null;
      return '100%';
    }
    // mode === "both"
    return this.draggedSize || defaultSize;
  };

  render() {
    const { children, layoutSelectors } = this.props;

    const mode = layoutSelectors.whatMode(MODE_KEY);
    const left = mode === MODE_RIGHT ? <noscript /> : children[0];
    const right = mode === MODE_LEFT ? <noscript /> : children[1];
    const size = this.sizeFromMode(mode, '50%');

    return (
      <SplitPane
        disabledClass=""
        ref={this.initializeComponent}
        split="vertical"
        defaultSize="50%"
        primary="second"
        minSize={0}
        size={size}
        onDragFinished={this.handleDragFinished}
        allowResize={mode !== MODE_LEFT && mode !== MODE_RIGHT}
        resizerStyle={{
          flex: '0 0 auto',
          position: 'relative',
          background: '#000',
          opacity: '.2',
          width: '11px',
          cursor: 'col-resize',
        }}
      >
        {left}
        {right}
      </SplitPane>
    );
  }
}

SplitPaneMode.propTypes = {
  threshold: PropTypes.number,
  children: PropTypes.node,
  layoutSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  layoutActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

SplitPaneMode.defaultProps = {
  threshold: 100, // in pixels
  children: [],
};
