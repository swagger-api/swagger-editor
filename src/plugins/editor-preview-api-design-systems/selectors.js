import { createSelector } from 'reselect';
import { from, toValue, isStringElement, isArrayElement } from '@swagger-api/apidom-core';
import {
  isMainElement,
  isInfoElement,
  isPrincipleElement,
  isStandardElement,
  isScenarioElement,
  isStandardIdentifierElement,
  isRequirementLevelElement,
} from '@swagger-api/apidom-ns-api-design-systems'; // eslint-disable-line import/no-unresolved

import apiDesignSystemsNamespace from './namespace.js';
import { initialState, FAILURE_STATUS, PARSING_STATUS, SUCCESS_STATUS } from './reducers.js';

const selectState = (state) => state;

export const selectParseResult = createSelector(selectState, (state) => {
  const parseResult = state.get('parseResult', initialState.parseResult);

  if (typeof parseResult !== 'string') {
    return null;
  }

  return from(parseResult, apiDesignSystemsNamespace);
});

export const selectParseError = createSelector(selectState, (state) => {
  return state.get('parseError', initialState.parseResult);
});

export const selectParseStatus = (state) => state.get('parseStatus') || initialState.parseStatus;

export const selectIsParseInProgress = createSelector(
  selectParseStatus,
  selectParseResult,
  selectParseError,
  (parseStatus, parseResult, parseErrors) => {
    return parseStatus === PARSING_STATUS && parseResult === null && parseErrors === null;
  }
);

export const selectIsParseSuccess = createSelector(
  selectParseStatus,
  (parseStatus) => parseStatus === SUCCESS_STATUS
);

export const selectIsParseFailure = createSelector(
  selectParseStatus,
  (parseStatus) => parseStatus === FAILURE_STATUS
);

export const selectMainElement = createSelector(selectParseResult, (parseResult) => {
  if (parseResult === null) return null;

  const { result } = parseResult;

  return isMainElement(result) ? result : null;
});

export const selectVersion = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return null;

  const { version } = mainElement;

  return isStringElement(version) ? toValue(version) : '2021-05-07';
});

export const selectInfo = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return null;

  const { info } = mainElement;

  return isInfoElement(info) ? toValue(info) : null;
});

export const selectPrinciplesCount = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return null;

  const { principles } = mainElement;

  return isArrayElement(principles) ? principles.length : 0;
});

export const selectStandardsCount = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return null;

  const { standards } = mainElement;

  return isArrayElement(standards) ? standards.length : 0;
});

export const selectScenariosCount = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return null;

  const { scenarios } = mainElement;

  return isArrayElement(scenarios) ? scenarios.length : 0;
});

export const selectPrinciples = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return [];

  const { principles } = mainElement;

  if (!isArrayElement(principles)) return [];

  return principles.filter(isPrincipleElement).toValue();
});

export const selectStandards = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return [];

  const { standards } = mainElement;

  if (!isArrayElement(standards)) return [];

  return standards.filter(isStandardElement).toValue();
});

export const selectScenarios = createSelector(selectMainElement, (mainElement) => {
  if (mainElement === null) return [];

  const { scenarios } = mainElement;

  if (!isArrayElement(scenarios)) return [];

  return scenarios.filter(isScenarioElement).elements;
});

export const selectStandardIdentifier = (state, { standardIdentifier }) => {
  if (!isStandardIdentifierElement(standardIdentifier)) return '[]';

  return `[${String(toValue(standardIdentifier)).replaceAll(',', ' > ')}]`;
};

export const selectScenarioDescription = (state, { scenarioElement }) => {
  if (!isScenarioElement(scenarioElement)) return '';
  if (!isStringElement(scenarioElement.description)) return '';

  return toValue(scenarioElement.description);
};

export const selectScenarioRequirements = (state, { scenarioElement }) => {
  if (!isScenarioElement(scenarioElement)) return [];
  if (!isArrayElement(scenarioElement.then)) return [];

  return scenarioElement.then.content;
};

export const selectRequirementLevel = (state, { requirementElement }) => {
  if (!isRequirementLevelElement(requirementElement.level)) return 'unknown';

  return toValue(requirementElement.level);
};

export const selectRequirementValues = (state, { requirementElement }) => {
  if (!isArrayElement(requirementElement.values)) return 'unknown';

  return String(toValue(requirementElement.values)).replaceAll(',', ', ');
};
