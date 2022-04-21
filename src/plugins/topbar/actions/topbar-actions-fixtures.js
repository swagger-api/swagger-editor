export const defaultFixtures = {
  isOAS3: true,
  isSwagger2: true,
  swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json',
  oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json',
  swagger2ConverterUrl: 'https://converter.swagger.io/api/convert',
  // oas3 & oas2 generator constants for servers list and clients list
  oas3GeneratorServersUrl: 'https://generator3.swagger.io/api/servers',
  oas3GeneratorClientsUrl: 'https://generator3.swagger.io/api/clients',
  oas2GeneratorServersUrl: 'https://generator.swagger.io/api/gen/servers',
  oas2GeneratorClientsUrl: 'https://generator.swagger.io/api/gen/clients',

  oas3GenerateSpecUrl: 'https://generator3.swagger.io/api/generate', // POST { lang: 'aspnetcore', spec: {}, type: 'SERVER' }
  oas2GenerateSpecServersUrl: 'https://generator.swagger.io/api/gen/servers',
  oas2GenerateSpecClientsUrl: 'https://generator.swagger.io/api/gen/clients',
  // oas2 examples:
  // https://generator.swagger.io/api/gen/servers/ada-server // OPTIONS req, then POST req. { spec: {} }
  // https://generator.swagger.io/api/gen/clients/ada // POST { spec: {} }
};

export const mockOas2Spec = {
  swagger: '2.0',
  info: {
    title: 'OAS2 response examples',
    version: '1.0.0',
  },
  produces: ['application/json'],
  paths: {
    '/foo1': {
      get: {
        summary: 'Response without a schema',
        responses: {
          200: {
            description: 'Successful response',
            examples: {
              'application/json': {
                foo: 'custom value no schema update fail apple',
              },
            },
          },
        },
      },
    },
    '/foo2': {
      get: {
        summary: 'Response with schema',
        responses: {
          200: {
            description: 'Successful response',
            schema: {
              $ref: '#/definitions/Foo',
            },
            examples: {
              'application/json': {
                foo: 'custom value changes ok',
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    Foo: {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          example: 'bar',
        },
      },
    },
  },
};

export const mockOas3Spec = {
  openapi: '3.0.2',
  info: {
    title: 'OAS 3.0 sample with multiple servers',
    version: '0.1.0',
  },
  servers: [
    {
      url: 'http://testserver1.com',
    },
    {
      url: 'http://testserver2.com',
    },
  ],
  paths: {
    '/test/': {
      get: {
        responses: {
          200: {
            description: 'Successful Response',
          },
        },
      },
    },
  },
};

// eslint-disable-next-line camelcase
export const mockOas3_1Spec = {
  openapi: '3.1.0',
  info: {
    title: 'deref',
    version: '1.0.0',
  },
  servers: [
    {
      description: 'local',
      url: 'http://localhost:8082/',
    },
  ],
  paths: {
    '/a': {
      get: {
        operationId: 'aget',
        parameters: [
          {
            $ref: '#/components/parameters/userId',
          },
        ],
      },
      post: {
        operationId: 'apost',
      },
    },
    '/b': {
      get: {
        operationId: 'bget',
        parameters: [
          {
            $ref: '#/components/parameters/userId',
          },
        ],
      },
      post: {
        operationId: 'bpost',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/foo',
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      foo: {
        type: 'string',
      },
      bar: {
        $id: 'http://localhost:8082/',
        type: 'string',
      },
    },
    parameters: {
      userId: {
        $ref: '#/components/parameters/indirection1',
        description: 'override',
      },
      indirection1: {
        $ref: '#/components/parameters/indirection2',
        summary: 'indirect summary',
      },
      indirection2: {
        $ref: '#/components/parameters/userIdRef',
        summary: 'indirect summary',
      },
      userIdRef: {
        name: 'userId',
        in: 'query',
        description: 'ID of the user',
        required: true,
      },
      externalRef: {
        $ref: './ex.json#/externalParameter',
        description: 'another ref',
      },
    },
  },
};

export const mockAsyncapi2Spec = {
  asyncapi: '2.3.0',
  info: {
    title: 'Streetlights Kafka API',
    version: '1.0.0',
    description:
      'The Smartylighting Streetlights API allows you to remotely manage the city lights.\n\n### Check out its awesome features:\n\n* Turn a specific streetlight on/off 🌃\n* Dim a specific streetlight 😎\n* Receive real-time information about environmental lighting conditions 📈\n',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0',
    },
  },
  servers: {
    test: {
      url: 'test.mykafkacluster.org:8092',
      protocol: 'kafka-secure',
      description: 'Test broker',
      security: [
        {
          saslScram: [],
        },
      ],
    },
  },
  defaultContentType: 'application/json',
  channels: {
    'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured': {
      description: 'The topic on which measured values may be produced and consumed.',
      parameters: {
        streetlightId: {
          $ref: '#/components/parameters/streetlightId',
        },
      },
      publish: {
        summary: 'Inform about environmental lighting conditions of a particular streetlight.',
        operationId: 'receiveLightMeasurement',
        traits: [
          {
            $ref: '#/components/operationTraits/kafka',
          },
        ],
        message: {
          $ref: '#/components/messages/lightMeasured',
        },
      },
    },
    'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on': {
      parameters: {
        streetlightId: {
          $ref: '#/components/parameters/streetlightId',
        },
      },
      subscribe: {
        operationId: 'turnOn',
        traits: [
          {
            $ref: '#/components/operationTraits/kafka',
          },
        ],
        message: {
          $ref: '#/components/messages/turnOnOff',
        },
      },
    },
    'smartylighting.streetlights.1.0.action.{streetlightId}.turn.off': {
      parameters: {
        streetlightId: {
          $ref: '#/components/parameters/streetlightId',
        },
      },
      subscribe: {
        operationId: 'turnOff',
        traits: [
          {
            $ref: '#/components/operationTraits/kafka',
          },
        ],
        message: {
          $ref: '#/components/messages/turnOnOff',
        },
      },
    },
    'smartylighting.streetlights.1.0.action.{streetlightId}.dim': {
      parameters: {
        streetlightId: {
          $ref: '#/components/parameters/streetlightId',
        },
      },
      subscribe: {
        operationId: 'dimLight',
        traits: [
          {
            $ref: '#/components/operationTraits/kafka',
          },
        ],
        message: {
          $ref: '#/components/messages/dimLight',
        },
      },
    },
  },
  components: {
    messages: {
      lightMeasured: {
        name: 'lightMeasured',
        title: 'Light measured',
        summary: 'Inform about environmental lighting conditions of a particular streetlight.',
        contentType: 'application/json',
        traits: [
          {
            $ref: '#/components/messageTraits/commonHeaders',
          },
        ],
        payload: {
          $ref: '#/components/schemas/lightMeasuredPayload',
        },
      },
      turnOnOff: {
        name: 'turnOnOff',
        title: 'Turn on/off',
        summary: 'Command a particular streetlight to turn the lights on or off.',
        traits: [
          {
            $ref: '#/components/messageTraits/commonHeaders',
          },
        ],
        payload: {
          $ref: '#/components/schemas/turnOnOffPayload',
        },
      },
      dimLight: {
        name: 'dimLight',
        title: 'Dim light',
        summary: 'Command a particular streetlight to dim the lights.',
        traits: [
          {
            $ref: '#/components/messageTraits/commonHeaders',
          },
        ],
        payload: {
          $ref: '#/components/schemas/dimLightPayload',
        },
      },
    },
    schemas: {
      lightMeasuredPayload: {
        type: 'object',
        properties: {
          lumens: {
            type: 'integer',
            minimum: 0,
            description: 'Light intensity measured in lumens.',
          },
          sentAt: {
            $ref: '#/components/schemas/sentAt',
          },
        },
      },
      turnOnOffPayload: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            enum: ['on', 'off'],
            description: 'Whether to turn on or off the light.',
          },
          sentAt: {
            $ref: '#/components/schemas/sentAt',
          },
        },
      },
      dimLightPayload: {
        type: 'object',
        properties: {
          percentage: {
            type: 'integer',
            description: 'Percentage to which the light should be dimmed to.',
            minimum: 0,
            maximum: 100,
          },
          sentAt: {
            $ref: '#/components/schemas/sentAt',
          },
        },
      },
      sentAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date and time when the message was sent.',
      },
    },
    securitySchemes: {
      saslScram: {
        type: 'scramSha256',
        description: 'Provide your username and password for SASL/SCRAM authentication',
      },
    },
    parameters: {
      streetlightId: {
        description: 'The ID of the streetlight.',
        schema: {
          type: 'string',
        },
      },
    },
    messageTraits: {
      commonHeaders: {
        headers: {
          type: 'object',
          properties: {
            'my-app-header': {
              type: 'integer',
              minimum: 0,
              maximum: 100,
            },
          },
        },
      },
    },
    operationTraits: {
      kafka: {
        bindings: {
          kafka: {
            clientId: {
              type: 'string',
              enum: ['my-app-id'],
            },
          },
        },
      },
    },
  },
};

export const mockAsyncapiYaml =
  'asyncapi: 2.3.0\n' +
  'info:\n' +
  '  version: 0.1.9\n' +
  'servers:\n' +
  '  prod:\n' +
  '    url: https://petstore3.swagger.io/api/v3/pet\n' +
  'channels:\n' +
  '  4:\n' +
  '    subscribe:\n' +
  '      summary: A user signed up.\n' +
  '      message:\n' +
  '        payload:\n' +
  '          type: string\n';

export const mockAsyncApi2PetstoreKafka = {
  asyncapi: '2.3.0',
  info: {
    title: 'Petstore',
    version: '1.0.0',
    description: 'The PetStore running in Kafka',
  },
  channels: {
    'petstore.order.added': {
      publish: {
        message: {
          title: 'New order for pet',
          summary: 'A new order for a pet was added.',
          name: 'Order',
          contentType: 'application/json',
          payload: {
            $ref: '#/components/schemas/Order',
          },
        },
      },
    },
    'petstore.order.deleted': {
      publish: {
        message: {
          name: 'OrderId',
          contentType: 'application/json',
          payload: {
            type: 'integer',
            format: 'int64',
          },
        },
      },
    },
    'petstore.pet.added': {
      publish: {
        message: {
          name: 'Pet',
          contentType: 'application/json',
          payload: {
            $ref: '#/components/schemas/Pet',
          },
        },
      },
    },
    'petstore.pet.changed': {
      publish: {
        message: {
          name: 'Pet',
          contentType: 'application/json',
          payload: {
            $ref: '#/components/schemas/Pet',
          },
        },
      },
    },
    'petstore.pet.deleted': {
      publish: {
        message: {
          name: 'PetId',
          contentType: 'application/json',
          payload: {
            type: 'integer',
            format: 'int64',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Inventory: {
        type: 'object',
        additionalProperties: {
          type: 'integer',
          format: 'int64',
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10,
          },
          petId: {
            type: 'integer',
            format: 'int64',
            example: 198772,
          },
          quantity: {
            type: 'integer',
            format: 'int32',
            example: 7,
          },
          shipDate: {
            type: 'string',
            format: 'date-time',
          },
          status: {
            type: 'string',
            description: 'Order Status',
            example: 'approved',
            enum: ['placed', 'approved', 'delivered'],
          },
          complete: {
            type: 'boolean',
          },
        },
        xml: {
          name: 'order',
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 100000,
          },
          username: {
            type: 'string',
            example: 'fehguy',
          },
          address: {
            type: 'array',
            xml: {
              name: 'addresses',
              wrapped: true,
            },
            items: {
              $ref: '#/components/schemas/Address',
            },
          },
        },
        xml: {
          name: 'customer',
        },
      },
      Address: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
            example: '437 Lytton',
          },
          city: {
            type: 'string',
            example: 'Palo Alto',
          },
          state: {
            type: 'string',
            example: 'CA',
          },
          zip: {
            type: 'string',
            example: '94301',
          },
        },
        xml: {
          name: 'address',
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Dogs',
          },
        },
        xml: {
          name: 'category',
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10,
          },
          username: {
            type: 'string',
            example: 'theUser',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'James',
          },
          email: {
            type: 'string',
            example: 'john@email.com',
          },
          password: {
            type: 'string',
            example: '12345',
          },
          phone: {
            type: 'string',
            example: '12345',
          },
          userStatus: {
            type: 'integer',
            description: 'User Status',
            format: 'int32',
            example: 1,
          },
        },
        xml: {
          name: 'user',
        },
      },
      Tag: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
        },
        xml: {
          name: 'tag',
        },
      },
      Pet: {
        required: ['name', 'photoUrls'],
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10,
          },
          name: {
            type: 'string',
            example: 'doggie',
          },
          category: {
            $ref: '#/components/schemas/Category',
          },
          photoUrls: {
            type: 'array',
            xml: {
              wrapped: true,
            },
            items: {
              type: 'string',
              xml: {
                name: 'photoUrl',
              },
            },
          },
          tags: {
            type: 'array',
            xml: {
              wrapped: true,
            },
            items: {
              $ref: '#/components/schemas/Tag',
            },
          },
          status: {
            type: 'string',
            description: 'pet status in the store',
            enum: ['available', 'pending', 'sold'],
          },
        },
        xml: {
          name: 'pet',
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            format: 'int32',
          },
          type: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        xml: {
          name: '##default',
        },
      },
    },
  },
};
