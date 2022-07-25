import JumpFromPathToLine from './components/JumpFromPathToLine.jsx';
import { bestJumpPath } from './selectors.js';

const EditorContentJumpFromPathToLinePlugin = () => ({
  components: {
    JumpToPath: JumpFromPathToLine, // SwaggerUI component
  },
  statePlugins: {
    editor: {
      selectors: {
        bestJumpPath,
      },
    },
  },
});

export default EditorContentJumpFromPathToLinePlugin;
