import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as apidomLS from 'apidom-ls'; // this does not load as Module, "Module not found: Can't resolve"

import MonacoEditor from './MonacoEditor'; // load directly, do not use getComponent
import LanguageSelection from './LanguageSelection'; // this is a dev component; expect to remove
import { getDefinitionLanguage } from '../../../utils/utils-converter';
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
      language: 'json',
    };
    this.editorDidMount = this.editorDidMount.bind(this);
  }

  componentDidMount() {
    // add if/when necessary
    // console.log('test: expect import to be `Module` of apidomLS', apidomLS); // this experiment works
    // eslint-disable-next-line no-unused-vars
    const { getLanguageService } = apidomLS;
    // console.log('and getLanguageService:', getLanguageService);
    // const context: LanguageServiceContext = {};
    // const languageService = getLanguageService(context);
    // console.log(JSON.stringify(languageService.getSemanticTokensLegend()));
  }

  componentDidUpdate() {
    // add if/when necessary
  }

  onChangeLanguageValue = async (val) => {
    console.log('attempt to onChangeLanguageValue. val:', val);
    if (val !== 'detect') {
      this.setState({ language: val });
    } else {
      console.log('... detecting language');
      const { specSelectors } = this.props;
      const spec = await specSelectors.specStr();
      if (spec) {
        const result = getDefinitionLanguage({ data: spec });
        console.log('... detected and will change to be:', result);
        this.setState({ language: result });
      }
    }
  };

  editorDidMount = (editor) => {
    editor.focus();
    // console.log('container editor mounted, should focus');
  };

  render() {
    const { initialValue, onChange, getValueFromSpec } = this.props;
    const { language } = this.state;

    const valueForEditor = getValueFromSpec();

    return (
      <div id="editor-wrapper" className="editor-wrapper">
        <h3>Monaco Editor (remove this heading for production)</h3>
        <LanguageSelection onChange={this.onChangeLanguageValue} />
        <MonacoEditor
          language={language}
          value={valueForEditor}
          defaultValue={initialValue}
          height="90vh"
          width="50"
          options={{ theme: 'vs-light' }}
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
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
