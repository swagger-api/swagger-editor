import yaml from 'js-yaml';

/* eslint-disable no-param-reassign */

export async function parse({ message, defaultSchemaFormat }) {
  try {
    let { payload } = message;
    if (typeof payload === 'object') {
      payload = yaml.dump(payload);
    }

    message['x-parser-original-schema-format'] = message.schemaFormat || defaultSchemaFormat;
    message['x-parser-original-payload'] = payload;
    message.payload = { description: `\`\`\`raml\n${payload}\n\`\`\`` };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}

export function getMimeTypes() {
  return ['application/raml+yaml;version=1.0'];
}
