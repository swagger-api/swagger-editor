import channelCompleteYaml from './complete/yaml';
import channelCompleteJson from './complete/json';
import channelDocs from './docs/channel';

const channelMeta = {
  documentation: channelDocs,
  yaml: channelCompleteYaml,
  json: channelCompleteJson,
};

export default channelMeta;
