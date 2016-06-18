'use strict';

var angular = require('angular');

describe('Service: JSONSchema', function() {
  var schema;

  // load the service's module
  beforeEach(angular.mock.module('SwaggerEditor'));

  // instantiate service
  var JSONSchema;
  beforeEach(inject(function(_JSONSchema_) {
    JSONSchema = _JSONSchema_;
  }));

  it('should exists', function() {
    expect(Boolean(JSONSchema)).to.equal(true);
  });

  describe('normalizeJSONSchema', function() {
    beforeEach(function() {
      schema = {
        in: 'query',
        name: 'id'
      };
    });

    it('should have title when schema doesnt have title', function() {
      schema.type = 'string';
      JSONSchema.normalizeJSONSchema(schema);
      expect(schema.title).to.be.equal('id');
    });

    it('should assign type to be string if it is file', function() {
      schema.type = 'file';
      JSONSchema.normalizeJSONSchema(schema);
      expect(schema.type).to.be.equal('string');
      expect(schema.format).to.be.equal('file');
    });

    it('should get the type from the items value if it has items', function() {
      schema.items = {type: 'string'};
      JSONSchema.normalizeJSONSchema(schema);
      expect(schema.type).to.be.equal('array');
    });
  });

  describe('resolveAllOf', function() {
    beforeEach(function() {
      schema = {
        properties: {
          foo: {
            allOf: [
              {
                type: 'object',
                properties: {
                  fistName: {
                    type: 'string'
                  }
                }
              },
              {
                type: 'object',
                properties: {
                  lastName: {
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };
    });

    it('should resolve allOf deeply', function() {
      var resolved = {
        properties: {
          foo: {
            type: 'object',
            properties: {
              fistName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              }
            }
          }
        }
      };
      var newSchema = JSONSchema.resolveAllOf(schema);
      expect(newSchema).to.deep.equal(resolved);
    });
  });
});
