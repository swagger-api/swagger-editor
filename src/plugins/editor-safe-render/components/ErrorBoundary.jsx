import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  static defaultState = { hasError: false, error: null, editorContent: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  constructor(...args) {
    super(...args);
    this.state = this.constructor.defaultState;
  }

  componentDidMount() {
    const { editorSelectors } = this.props;

    this.setState({ editorContent: editorSelectors.selectContent() });
  }

  componentDidUpdate(prevProps, prevState) {
    const { editorSelectors } = this.props;
    const hasEditorContentChanged = prevState.editorContent !== editorSelectors.selectContent();

    if (!hasEditorContentChanged) return;

    const newState = { editorContent: editorSelectors.selectContent() };

    if (prevState.hasError) {
      newState.hasError = false;
      newState.error = null;
    }

    this.setState(newState);
  }

  componentDidCatch(error, errorInfo) {
    const {
      fn: { componentDidCatch },
    } = this.props;

    componentDidCatch(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { getComponent, targetName, children } = this.props;

    if (hasError && error) {
      const FallbackComponent = getComponent('Fallback');
      return <FallbackComponent name={targetName} />;
    }

    return children;
  }
}
ErrorBoundary.propTypes = {
  targetName: PropTypes.string,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.shape({
    componentDidCatch: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
ErrorBoundary.defaultProps = {
  targetName: 'this component',
  children: null,
};

export default ErrorBoundary;
