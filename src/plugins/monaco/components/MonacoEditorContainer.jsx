import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import * as apidomLS from 'apidom-ls'; // this does not load as Module, "Module not found: Can't resolve"

import MonacoEditor from './MonacoEditor'; // load directly, do not use getComponent
import ThemeSelection from './ThemeSelection';
// import monaco from '../../../../test/__mocks__/monacoMock';

/**
 * This container should only contain methods to manage MonacoEditor,
 * should be independent of "Swagger",
 * and should not contain "editor"-agnostic methods
 * */

export default class MonacoEditorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      language: 'apidom',
      theme: 'vs',
    };
    this.editorDidMount = this.editorDidMount.bind(this);
  }

  componentDidMount() {
    // add if/when necessary
    // console.log('test: expect import to be `Module` of apidomLS', apidomLS); // this experiment works
    // eslint-disable-next-line no-unused-vars
    // const { getLanguageService } = apidomLS;
    // console.log('and getLanguageService:', getLanguageService);
    // const context: LanguageServiceContext = {};
    // const languageService = getLanguageService(context);
    // console.log(JSON.stringify(languageService.getSemanticTokensLegend()));
  }

  componentDidUpdate() {
    // add if/when necessary
  }

  onChangeThemeValue = async (val) => {
    console.log('attempt to onChangeThemeValue. val:', val);
    const defaultThemeList = ['vs', 'vs-light', 'vs-dark'];
    if (!defaultThemeList.includes(val)) {
      return;
    }
    this.setState({ theme: val });
  };

  editorDidMount = (editor) => {
    editor.focus();
    // console.log('container editor mounted, should focus');
  };

  render() {
    const { initialValue, onChange, getValueFromSpec } = this.props;
    const { language, theme } = this.state;

    const valueForEditor = getValueFromSpec();

    return (
      <div id="editor-wrapper" className="editor-wrapper">
        <h3>Monaco Editor (remove this heading for production)</h3>
        <ThemeSelection onChange={this.onChangeThemeValue} />
        <MonacoEditor
          language={language}
          theme={theme}
          value={valueForEditor}
          defaultValue={initialValue}
          height="90vh"
          width="50"
          onChange={onChange}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}

MonacoEditorContainer.defaultProps = {
  initialValue: '',
};

MonacoEditorContainer.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  getValueFromSpec: PropTypes.func.isRequired,
};
