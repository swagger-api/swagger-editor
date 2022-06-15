import { parse, parseIdle, parseStarted, parseSuccess, parseFailure } from './actions.js';
import { updateSpec } from './wrap-actions.js';
import {
  selectIsAPIDesignSystemsSpec,
  selectMainElement,
  selectVersion,
  selectInfo,
  selectPrinciplesCount,
  selectStandardsCount,
  selectScenariosCount,
  selectPrinciples,
  selectStandards,
  selectScenarios,
  selectStandardIdentifier,
  selectScenarioDescription,
  selectScenarioRequirements,
  selectRequirementLevel,
  selectRequirementValues,
  selectApiDOM,
  selectAPIDesignSystems,
  selectParsingStatus,
} from './selectors.js';
import reducers from './reducers.js';
import Main from './components/Main.jsx';
import Info from './components/Info.jsx';
import Principles from './components/Principles.jsx';
import Principle from './components/Principle.jsx';
import Standards from './components/Standards.jsx';
import Standard from './components/Standard.jsx';
import Scenarios from './components/Scenarios.jsx';
import Scenario from './components/Scenario.jsx';
import Requirement from './components/Requirement.jsx';
import EditorPreviewPaneWrapper from './wrap-components/EditorPreviewPaneWrapper.jsx';

const EditorPreviewApiDesignSystems = () => {
  return {
    components: {
      ADSMain: Main,
      ADSInfo: Info,
      ADSPrinciples: Principles,
      ADSPrinciple: Principle,
      ADSStandards: Standards,
      ADSStandard: Standard,
      ADSScenarios: Scenarios,
      ADSScenario: Scenario,
      ADSRequirement: Requirement,
    },
    wrapComponents: {
      EditorPreviewPane: EditorPreviewPaneWrapper,
    },
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec,
        },
      },
      ads: {
        actions: {
          parse,
          parseIdle,
          parseStarted,
          parseSuccess,
          parseFailure,
        },
        selectors: {
          selectIsAPIDesignSystemsSpec,
          selectMainElement,
          selectVersion,
          selectInfo,
          selectPrinciplesCount,
          selectStandardsCount,
          selectScenariosCount,
          selectPrinciples,
          selectStandards,
          selectScenarios,
          selectStandardIdentifier,
          selectScenarioDescription,
          selectScenarioRequirements,
          selectRequirementLevel,
          selectRequirementValues,
          selectApiDOM,
          selectAPIDesignSystems,
          selectParsingStatus,
        },
        reducers,
      },
    },
  };
};

export default EditorPreviewApiDesignSystems;
