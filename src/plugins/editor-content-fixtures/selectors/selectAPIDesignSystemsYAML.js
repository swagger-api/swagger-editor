const selectAPIDesignSystemsYAML = () => `version: '2021-05-07'
info:
  title: SmartBear API Guidelines
  description: |
    A machine and human readable version of the SmartBear API Style Guide aimed at promoting living API Style Governance across various tools and teams, leading to improved API quality.
    See the [SmartBear Standards and Guidelines](https://github.com/SmartBear/api-standards-and-guidelines) repo for a traditional view of the static guidelines.
principles:
- iri: urn:apidesign.systems:principle:robustness
  level: must
- iri: urn:apidesign.systems:principle:rmm:level2
  level: must
- iri: urn:apidesign.systems:principle:rmm:level3
  level: should
standards:
- iri: urn:ietf:rfc:6648
  level: must
- iri: urn:ietf:rfc:7807
  level: must
- iri: urn:ietf:rfc:7231
  level: should
- iri: urn:ietf:rfc:6585
  level: may
- iri: urn:ietf:rfc:5788
  level: may
- iri: urn:ietf:draft:http-semantics
  level: may
scenarios:
- description: SB-API-010 - Only apply standard HTTP methods
  when:
  - http
  - transaction
  then:
  - subject:
    - http
    - request
    - method
    level: may
    values:
    - get
    - post
    - put
    - patch
    - delete
  - subject:
    - http
    - request
    - header
    level: may
    values:
    - Accept
    - Accept-Charset
    - Authorization
    - Content-Language
    - Content-Type
    - Link
    - Prefer
  - subject:
    - http
    - request
    - header
    - Content-Type
    level: may
    values:
    - application/json
    - application/hal+json
  - subject:
    - http
    - response
    - header
    - Content-Type
    level: should
    values:
    - application/hal+json
  - subject:
    - http
    - response
    - header
    - Content-Type
    level: may
    values:
    - application/json
    - application/hal+json
    - application/problem+json
- description: GET Methods - Allowed status codes
  when:
  - http
  - request
  - method
  - get
  then:
  - subject:
    - http
    - response
    - status_code
    level: may
    values:
    - '200'
    - '304'
    - '400'
    - '401'
    - '403'
    - '404'
    - '405'
    - '422'
    - '429'
    - '500'
    - '501'
    - '503'
- description: POST Method - Allowed status codes
  when:
  - http
  - request
  - method
  - post
  then:
  - subject:
    - http
    - response
    - status_code
    level: may
    values:
    - '200'
    - '201'
    - '202'
    - '400'
    - '401'
    - '403'
    - '404'
    - '405'
    - '409'
    - '415'
    - '422'
    - '429'
    - '500'
    - '501'
    - '503'
- description: PUT Method - Allowed status codes
  when:
  - http
  - request
  - method
  - put
  then:
  - subject:
    - http
    - response
    - status_code
    level: may
    values:
    - '200'
    - '201'
    - '202'
    - '204'
    - '400'
    - '401'
    - '403'
    - '404'
    - '405'
    - '409'
    - '412'
    - '415'
    - '422'
    - '429'
    - '500'
    - '501'
    - '503'
- description: PATCH Method - Allowed status codes
  when:
  - http
  - request
  - method
  - patch
  then:
  - subject:
    - http
    - response
    - status_code
    level: may
    values:
    - '200'
    - '202'
    - '204'
    - '400'
    - '401'
    - '403'
    - '404'
    - '405'
    - '409'
    - '412'
    - '415'
    - '422'
    - '429'
    - '500'
    - '501'
    - '503'
- description: DELETE Method - Allowed status codes
  when:
  - http
  - request
  - method
  - delete
  then:
  - subject:
    - http
    - response
    - status_code
    level: may
    values:
    - '200'
    - '202'
    - '204'
    - '400'
    - '401'
    - '403'
    - '404'
    - '405'
    - '409'
    - '412'
    - '415'
    - '422'
    - '429'
    - '500'
    - '501'
    - '503'
- description: Client Errors must return \`application/problem+json\`
  when:
  - http
  - response
  - status_code
  - client_error
  then:
  - subject:
    - http
    - response
    - header
    - Content-Type
    level: must
    values:
    - application/problem+json
- description: Server Errors must return \`application/problem+json\`
  when:
  - http
  - response
  - status_code
  - server_error
  then:
  - subject:
    - http
    - response
    - header
    - Content-Type
    level: must
    values:
    - application/problem+json
`;

export default selectAPIDesignSystemsYAML;
