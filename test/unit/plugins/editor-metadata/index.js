import SwaggerUI from 'swagger-ui';
import EditorMetadataPlugin from 'plugins/editor-metadata';

function getSystem(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUI({
      spec,
      domNode: null,
      presets: [
        SwaggerUI.plugins.SpecIndex,
        SwaggerUI.plugins.ErrIndex,
        SwaggerUI.plugins.DownloadUrl,
        SwaggerUI.plugins.SwaggerJsIndex,
        SwaggerUI.plugins.RequestSnippetsIndex,
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        EditorMetadataPlugin,
        () => ({
          statePlugins: {
            configs: {
              actions: {
                loaded: () => {
                  return {
                    type: 'noop'
                  };
                }
              }
            }
          }
        })
      ]
    });

    resolve(system);
  });
}

describe('editor metadata plugin', () => {

  it('should provide a `getEditorMetadata` method', async () => {
    const spec = {};

    const system = await getSystem(spec);

    expect(system.getEditorMetadata).toBeInstanceOf(Function);
  });

  it(
    'should return JS object spec content from the `getEditorMetadata` method',
    async () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/': {
            get: {
              description: 'hello there!',
              responses: {
                '200': {
                  description: 'ok'
                }
              }
            }
          }
        }
      };

      const system = await getSystem(spec);

      expect(system.getEditorMetadata().contentString).toEqual('{"swagger":"2.0","paths":{"/":{"get":{"description":"hello there!","responses":{"200":{"description":"ok"}}}}}}');
      expect(system.getEditorMetadata().contentObject).toEqual(spec);
    }
  );


  it(
    'should return YAML string spec content from the `getEditorMetadata` method',
    async () => {
      const spec = `---
      swagger: '2.0'
      paths:
        "/":
          get:
            description: hello there!
            responses:
              '200':
                description: ok`;

      const system = await getSystem();

      system.specActions.updateSpec(spec);

      expect(system.getEditorMetadata().contentString).toEqual(spec);
      expect(system.getEditorMetadata().contentObject).toEqual({
        swagger: '2.0',
        paths: {
          '/': {
            get: {
              description: 'hello there!',
              responses: {
                '200': {
                  description: 'ok'
                }
              }
            }
          }
        }
      });
    }
  );

  it('should return isValid for a valid spec', async () => {
    const spec = {
      swagger: '2.0',
      paths: {
        '/': {
          get: {
            description: 'hello there!',
            responses: {
              '200': {
                description: 'ok'
              }
            }
          }
        }
      }
    };

    const system = await getSystem(spec);

    expect(typeof system.getEditorMetadata().isValid).toBe('boolean');
    expect(system.getEditorMetadata().isValid).toBe(true);
  });


  it('should return isValid for an invalid spec', async () => {
    const spec = {
      swagger: '2.0',
      paths: {
        '/': {
          get: {
            description: 'hello there!',
            responses: {
              '200': {
                description: 'ok'
              }
            }
          }
        }
      }
    };

    const err = {
      type: 'spec',
      message: 'it\'s broken!'
    };

    const system = await getSystem(spec);

    system.errActions.newSpecErr(err);

    expect(typeof system.getEditorMetadata().isValid).toBe('boolean');
    expect(system.getEditorMetadata().isValid).toBe(false);
    expect(system.getEditorMetadata().errors).toEqual([err]);
  });
});
