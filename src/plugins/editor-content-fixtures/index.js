import selectAsyncAPI240JSON from './selectors/selectAsyncAPI240JSON.js';
import selectAsyncAPI240PetstoreJSON from './selectors/selectAsyncAPI240PetstoreJSON.js';
import selectOpenAPI20JSON from './selectors/selectOpenAPI20JSON.js';
import selectOpenAPI303JSON from './selectors/selectOpenAPI303JSON.js';
import selectOpenAPI310JSON from './selectors/selectOpenAPI310JSON.js';

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectAsyncAPI240JSON,
        selectAsyncAPI240PetstoreJSON,
        selectOpenAPI20JSON,
        selectOpenAPI303JSON,
        selectOpenAPI310JSON,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
