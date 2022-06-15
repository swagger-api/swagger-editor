import { createSelector } from 'reselect';
import {
  from,
  toValue,
  createNamespace,
  isStringElement,
  isArrayElement,
} from '@swagger-api/apidom-core';
import namespace, {
  isMainElement,
  isInfoElement,
  isPrincipleElement,
  isStandardElement,
  isScenarioElement,
  isStandardIdentifierElement,
  isRequirementLevelElement,
} from '@swagger-api/apidom-ns-api-design-systems'; // eslint-disable-line import/no-unresolved

import { initialState } from './reducers.js';

const apiDesignSystemsNamespace = createNamespace(namespace);

export const selectAPIDesignSystems = (state) => state;

export const selectApiDOM = (state) => state.get('apiDOM') || initialState.apiDOM;

export const selectParsingStatus = (state) =>
  state.get('parsingStatus') || initialState.parsingStatus;

export const selectMainElement = createSelector(selectApiDOM, (apiDOM) => {
  if (typeof apiDOM !== 'string') return null;

  return from(apiDOM, apiDesignSystemsNamespace);
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

export const selectIsAPIDesignSystemsSpec = createSelector(
  selectParsingStatus,
  selectMainElement,
  (parsingStatus, mainElement) => {
    return parsingStatus === 'success' && isMainElement(mainElement);
  }
);
