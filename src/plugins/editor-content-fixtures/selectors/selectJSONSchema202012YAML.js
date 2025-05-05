const selectJSONSchema202012YAML = () => `$schema: https://json-schema.org/draft/2020-12/schema
$id: https://example.com/json-schema-2020-12
title: JSON Schema 2020-12 Example
description: Example JSON Schema 2020-12 document
version: 1.0.0
type: object
properties:
  id:
    type: integer
    format: int64
    examples: [10]
  name:
    type: string
    examples: [doggie]
  category:
    $ref: '#/$defs/Category'
  photoUrls:
    type: array
    xml:
      wrapped: true
    items:
      type: string
      xml:
        name: photoUrl
  tags:
    type: array
    xml:
      wrapped: true
    items:
      $ref: '#/$defs/Tag'
  status:
    type: string
    description: pet status in the store
    enum:
      - available
      - pending
      - sold
required:
  - name
  - photoUrls
xml:
  name: pet
if:
  properties:
    status:
      const: available
then:
  properties:
    photoUrls:
      minItems: 1
dependentRequired:
  category: [tags]
$defs:
  Category:
    type: object
    properties:
      id:
        type: integer
        format: int64
        examples: [1]
      name:
        type: string
        examples: [Dogs]
    xml:
      name: category
  Tag:
    type: object
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
    xml:
      name: tag
`;

export default selectJSONSchema202012YAML;
