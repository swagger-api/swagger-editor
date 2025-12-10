import { createRulesetFunction } from '@stoplight/spectral-core';

/**
 * Copy of @asyncapi/parser function which causes issues with resolved definitions.
 * Replacing the original function with this copy fixes the issue.
 * https://github.com/asyncapi/parser-js/blob/master/packages/parser/src/ruleset/v3/functions/operationMessagesUnambiguity.ts
 */

const referenceSchema = {
  type: 'object',
  properties: {
    $ref: {
      type: 'string',
      format: 'uri-reference',
    },
  },
};

// eslint-disable-next-line import/prefer-default-export
export const operationMessagesUnambiguity = createRulesetFunction(
  {
    input: {
      type: 'object',
      properties: {
        channel: referenceSchema,
        messages: {
          type: 'array',
          items: referenceSchema,
        },
      },
    },
    options: null,
  },
  (targetVal, _, ctx) => {
    const results = [];
    const channelPointer = targetVal.channel?.$ref; // required

    targetVal.messages?.forEach((message, index) => {
      if (message.$ref && !message.$ref.startsWith(`${channelPointer}/messages`)) {
        results.push({
          message: 'Operation message does not belong to the specified channel.',
          path: [...ctx.path, 'messages', index],
        });
      }
    });

    return results;
  }
);
