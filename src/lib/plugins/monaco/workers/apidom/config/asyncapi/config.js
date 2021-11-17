import asyncapi2Meta from './asyncapi2/meta';
import asyncapiVersionMeta from './asyncApiVersion/meta';
import jsonSchemaTypeMeta from '../common/json-schema-type/meta';
import jsonSchemaMeta from '../common/schema/meta';
import securitySchemeMeta from './securityScheme/meta';
import infoMeta from '../common/info/meta';
import contactMeta from '../common/contact/meta';
import operationMeta from '../common/operation/meta';
import channelMeta from './channel/meta';
import serversMeta from './servers/meta';

export default {
  '*': {
    lint: [],
  },
  info: infoMeta,
  contact: contactMeta,
  operation: operationMeta,
  channel: channelMeta,
  asyncApi2: asyncapi2Meta,
  asyncApiVersion: asyncapiVersionMeta,
  'json-schema-type': jsonSchemaTypeMeta,
  schema: jsonSchemaMeta,
  securityScheme: securitySchemeMeta,
  servers: serversMeta,
};
