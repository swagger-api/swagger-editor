import selectAsyncAPI250JSON from './selectors/selectAsyncAPI250JSON.js';
import selectAsyncAPI250PetstoreJSON from './selectors/selectAsyncAPI250PetstoreJSON.js';
import selectOpenAPI20JSON from './selectors/selectOpenAPI20JSON.js';
import selectOpenAPI303JSON from './selectors/selectOpenAPI303JSON.js';
import selectOpenAPI310JSON from './selectors/selectOpenAPI310JSON.js';
import selectAPIDesignSystemsJSON from './selectors/selectAPIDesignSystemsJSON.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectOpenAPI30PetstoreYAML from './selectors/selectOpenAPI30PetstoreYAML.js';

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectAsyncAPI250JSON,
        selectAsyncAPI250PetstoreJSON,
        selectOpenAPI20JSON,
        selectOpenAPI303JSON,
        selectOpenAPI310JSON,
        selectAPIDesignSystemsJSON,
        selectOpenAPI20PetstoreYAML,
        selectOpenAPI30PetstoreYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
