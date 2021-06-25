
import React from 'react';
import SwaggerUi from 'swagger-ui';
import insertPlugin from 'src/standalone/topbar-insert';
import { fromJS } from 'immutable';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

function getSystem(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        SwaggerUi.plugins.DownloadUrl,
        SwaggerUi.plugins.SwaggerJsIndex,
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        insertPlugin,
        () => ({
          statePlugins: {
            spec: {
              wrapSelectors: {
                isOAS3: () => () => true
              }
            }
          }
        }),
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

describe('editor topbar insert menu plugin', () => {

  it('should provide a `addToSpec` method as a spec action', async () => {
    const spec = {};
    const system = await getSystem(spec);
    expect(system.specActions.addToSpec).toBeInstanceOf(Function);
  });

  it(
    'should provide an <InsertMenu /> component to render a menu option',
    async () => {
      const spec = {};
      const system = await getSystem(spec);
      const InsertMenu = system.getSystem().getComponents('TopbarInsert');
      let wrapper = mount(<InsertMenu {...system} getComponent={(c) => system.getSystem().getComponents(c)} />);
      expect(wrapper.find('.menu-item').length).toEqual(1);
    }
  );

  it('should correctly update the spec when addToSpec is called', async () => {
    const spec = {
      'openapi': '3.0.0',
      'info': {
        'version': '1.0.0',
        'title': 'My New Service'
      },
      'paths': {
        '/test': {
          'get': {
            'summary': 'Sample endpoint for my awesome service.',
            'responses': {
              '200': {
                'description': 'OK'
              }
            }
          }
        }
      }
    };

    const toAdd = fromJS({
      'summary': 'Sample endpoint for my awesome service.',
      'responses': {
        '200': {
          'description': 'OK'
        }
      }
    });

    const expected = {
      'openapi': '3.0.0',
      'info': {
        'version': '1.0.0',
        'title': 'My New Service'
      },
      'paths': {
        '/test': {
          'get': {
            'summary': 'Sample endpoint for my awesome service.',
            'responses': {
              '200': {
                'description': 'OK'
              }
            }
          },
          'post': {
            'summary': 'Sample endpoint for my awesome service.',
            'responses': {
              '200': {
                'description': 'OK'
              }
            }
          }
        }
      }
    };

    const system = await getSystem(spec);

    system.specActions.addToSpec(['paths', '/test'], toAdd, 'post');
    expect(system.specSelectors.specJson().toJS()).toEqual(expected);
  });
});
