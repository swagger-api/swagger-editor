import pluginImpl from './plugin-impl';
import { usePropChange, useMountPlugin } from './hooks/index';

/**
 * This plugin is meant to be utilized via the `useMountPlugin` hook.
 */
const PropsChangeWatcherPlugin = () => {
  return pluginImpl;
};
PropsChangeWatcherPlugin.usePropChange = usePropChange;
PropsChangeWatcherPlugin.useMountPlugin = useMountPlugin;

export default PropsChangeWatcherPlugin;
