import {
  ConsoleLogger,
  LogLevel,
} from '@codingame/monaco-vscode-api/vscode/vs/platform/log/common/log';

class CustomLogger extends ConsoleLogger {
  constructor() {
    super(import.meta.env.DEV ? LogLevel.Info : LogLevel.Warning);
  }
}

export default CustomLogger;
