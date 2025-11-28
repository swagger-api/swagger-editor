import {
  ConsoleLogger,
  LogLevel,
} from '@codingame/monaco-vscode-api/vscode/vs/platform/log/common/log';

class CustomLogger extends ConsoleLogger {
  constructor() {
    super(process.env.NODE_ENV === 'development' ? LogLevel.Info : LogLevel.Warning);
  }
}

export default CustomLogger;
