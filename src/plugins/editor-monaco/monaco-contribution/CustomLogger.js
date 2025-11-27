import {
  ConsoleLogger,
  LogLevel,
} from '@codingame/monaco-vscode-api/vscode/vs/platform/log/common/log';

class CustomLogger extends ConsoleLogger {
  constructor() {
    super(LogLevel.Warning);
  }
}

export default CustomLogger;
