const selectAsyncAPI300StreetlightsYAML = () => `asyncapi: 3.0.0
info:
  title: Streetlights Kafka API
  version: 1.0.0
  description: "The Smartylighting Streetlights API allows you to remotely manage the city lights.\\n\\n### Check out its awesome features:\\n\\n* Turn a specific streetlight on/off \\U0001F303\\n* Dim a specific streetlight \\U0001F60E\\n* Receive real-time information about environmental lighting conditions \\U0001F4C8\\n"
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
defaultContentType: application/json
servers:
  scram-connections:
    host: 'test.mykafkacluster.org:18092'
    protocol: kafka-secure
    description: Test broker secured with scramSha256
    security:
      - $ref: '#/components/securitySchemes/saslScram'
    tags:
      - name: 'env:test-scram'
        description: >-
          This environment is meant for running internal tests through
          scramSha256
      - name: 'kind:remote'
        description: This server is a remote server. Not exposed by the application
      - name: 'visibility:private'
        description: This resource is private and only available to certain users
  mtls-connections:
    host: 'test.mykafkacluster.org:28092'
    protocol: kafka-secure
    description: Test broker secured with X509
    security:
      - $ref: '#/components/securitySchemes/certs'
    tags:
      - name: 'env:test-mtls'
        description: This environment is meant for running internal tests through mtls
      - name: 'kind:remote'
        description: This server is a remote server. Not exposed by the application
      - name: 'visibility:private'
        description: This resource is private and only available to certain users
channels:
  lightingMeasured:
    address: 'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured'
    messages:
      lightMeasured:
        $ref: '#/components/messages/lightMeasured'
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOn:
    address: 'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on'
    messages:
      turnOn:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOff:
    address: 'smartylighting.streetlights.1.0.action.{streetlightId}.turn.off'
    messages:
      turnOff:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightsDim:
    address: 'smartylighting.streetlights.1.0.action.{streetlightId}.dim'
    messages:
      dimLight:
        $ref: '#/components/messages/dimLight'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
operations:
  receiveLightMeasurement:
    action: receive
    channel:
      $ref: '#/channels/lightingMeasured'
    summary: >-
      Inform about environmental lighting conditions of a particular
      streetlight.
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightingMeasured/messages/lightMeasured'
  turnOn:
    action: send
    channel:
      $ref: '#/channels/lightTurnOn'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOn/messages/turnOn'
  turnOff:
    action: send
    channel:
      $ref: '#/channels/lightTurnOff'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOff/messages/turnOff'
  dimLight:
    action: send
    channel:
      $ref: '#/channels/lightsDim'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightsDim/messages/dimLight'
components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: >-
        Inform about environmental lighting conditions of a particular
        streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredPayload'
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/turnOnOffPayload'
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/dimLightPayload'
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    turnOnOffPayload:
      type: object
      properties:
        command:
          type: string
          enum:
            - 'on'
            - 'off'
          description: Whether to turn on or off the light.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: Percentage to which the light should be dimmed to.
          minimum: 0
          maximum: 100
        sentAt:
          $ref: '#/components/schemas/sentAt'
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.
  securitySchemes:
    saslScram:
      type: scramSha256
      description: Provide your username and password for SASL/SCRAM authentication
    certs:
      type: X509
      description: Download the certificate files from service provider
  parameters:
    streetlightId:
      description: The ID of the streetlight.
  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
  operationTraits:
    kafka:
      bindings:
        kafka:
          clientId:
            type: string
            enum:
              - my-app-id
`;

export default selectAsyncAPI300StreetlightsYAML;
