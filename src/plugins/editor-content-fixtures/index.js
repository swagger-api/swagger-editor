import selectOpenAPI320PetstoreYAML from './selectors/selectOpenAPI320PetstoreYAML.js';
import selectOpenAPI310PetstoreYAML from './selectors/selectOpenAPI310PetstoreYAML.js';
import selectOpenAPI304PetstoreYAML from './selectors/selectOpenAPI304PetstoreYAML.js';
import selectOpenAPI20PetstoreYAML from './selectors/selectOpenAPI20PetstoreYAML.js';
import selectAsyncAPI260PetstoreYAML from './selectors/selectAsyncAPI260PetstoreYAML.js';
import selectAsyncAPI310PetstoreYAML from './selectors/selectAsyncAPI310PetstoreYAML.js';
import selectAsyncAPI260StreetlightsYAML from './selectors/selectAsyncAPI260StreetlightsYAML.js';
import selectAsyncAPI310StreetlightsYAML from './selectors/selectAsyncAPI310StreetlightsYAML.js';
import selectJSONSchema202012YAML from './selectors/selectJSONSchema202012YAML.js';
import selectAPIDesignSystemsYAML from './selectors/selectAPIDesignSystemsYAML.js';
// test

const EditorContentFixturesPlugin = () => ({
  statePlugins: {
    editorContentFixtures: {
      selectors: {
        selectOpenAPI320PetstoreYAML,
        selectOpenAPI310PetstoreYAML,
        selectOpenAPI304PetstoreYAML,
        selectOpenAPI20PetstoreYAML,
        selectAsyncAPI260PetstoreYAML,
        selectAsyncAPI310PetstoreYAML,
        selectAsyncAPI260StreetlightsYAML,
        selectAsyncAPI310StreetlightsYAML,
        selectJSONSchema202012YAML,
        selectAPIDesignSystemsYAML,
      },
    },
  },
});

export default EditorContentFixturesPlugin;
