import pluginImpl from './plugin-impl.ts';
import { usePropChange, useMountPlugin } from './hooks/index.ts';

/**
 * This plugin is meant to be utilized via the `useMountPlugin` hook.
 */
const PropsChangeWatcherPlugin = () => {
  return pluginImpl;
};
PropsChangeWatcherPlugin.usePropChange = usePropChange;
PropsChangeWatcherPlugin.useMountPlugin = useMountPlugin;

export default PropsChangeWatcherPlugin;
