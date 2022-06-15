import {
  parse as parseJSON,
  detect as detectJSON,
} from '@swagger-api/apidom-ns-api-design-systems/adapters/json'; // eslint-disable-line import/no-unresolved
import {
  parse as parseYAML,
  detect as detectYAML,
} from '@swagger-api/apidom-ns-api-design-systems/adapters/yaml'; // eslint-disable-line import/no-unresolved

/**
 * Action types.
 */
export const ADS_PARSE_IDLE = 'ads/parseIdle';
export const ADS_PARSE_STARTED = 'ads/parseStarted';
export const ADS_PARSE_SUCCESS = 'ads/parseSuccess';
export const ADS_PARSE_FAILURE = 'ads/parseFailure';

/**
 * Action creators.
 */
export const parseIdle = (payload) => ({
  type: ADS_PARSE_IDLE,
  payload,
});

export const parseStarted = (payload) => ({
  type: ADS_PARSE_STARTED,
  payload,
});

export const parseSuccess = (payload) => ({
  type: ADS_PARSE_SUCCESS,
  payload,
});

export const parseFailure = (error) => ({
  type: ADS_PARSE_FAILURE,
  error,
});

/**
 * Async thunks.
 */
export const parse = (spec) => async (system) => {
  const { adsActions } = system;

  try {
    if (await detectJSON(spec)) {
      adsActions.parseStarted(spec);
      const parseResult = await parseJSON(spec);
      adsActions.parseSuccess(parseResult);
    } else if (await detectYAML(spec)) {
      adsActions.parseStarted(spec);
      const parseResult = await parseYAML(spec);
      adsActions.parseSuccess(parseResult);
    } else {
      adsActions.parseIdle(spec);
    }
  } catch (error) {
    adsActions.parseFailure(error);
  }
};
