
import SwaggerUi from 'swagger-ui';
import debounce from 'lodash/debounce';

import ValidateBasePlugin from 'plugins/validate-base';
import ValidateSemanticPlugin from 'plugins/validate-semantic';
import ASTPlugin from 'plugins/ast';

const envDelay = process.env.ASYNC_TEST_DELAY;

const DELAY_MS = (typeof envDelay === 'string' ? parseInt(envDelay) : envDelay) || 50;

export default function validateHelper(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        SwaggerUi.plugins.DownloadUrl,
        SwaggerUi.plugins.SwaggerJsIndex,
        SwaggerUi.plugins.Oas3Index
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        ASTPlugin,
        ValidateBasePlugin,
        ValidateSemanticPlugin,
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

    system.validateActions.all();

    const registerActivity = debounce(() => resolve(system), DELAY_MS);

    system.getStore().subscribe(registerActivity);
  });

}

export function expectNoErrorsOrWarnings(spec) {
  return validateHelper(spec)
    .then( system => {
      const allErrors = system.errSelectors.allErrors().toJS();
      expect(allErrors).toEqual([]);
    });
}

export function expectNoErrors(spec) {
  return validateHelper(spec)
    .then(system => {
      let allErrors = system.errSelectors.allErrors().toJS();
      allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
      expect(allErrors).toEqual([]);
    });
}
