import { previewUnmounted, parse, parseStarted, parseSuccess, parseFailure } from './actions.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './wrap-actions.js';
import {
  selectParseStatus,
  selectIsParseInProgress,
  selectIsParseFailure,
  selectIsParseSuccess,
  selectParseResult,
  selectParseError,
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
import EditorPreviewAPIDesignSystems from './components/EditorPreviewAPIDesignSystems.jsx';
import ParseErrors from './components/ParseErrors.jsx';
import EditorPreviewWrapper from './wrap-components/EditorPreviewWrapper.jsx';

const EditorPreviewApiDesignSystemsPlugin = () => {
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
      EditorPreviewAPIDesignSystems,
      EditorPreviewAPIDesignSystemsParseErrors: ParseErrors,
    },
    wrapComponents: {
      EditorPreviewPane: EditorPreviewWrapper,
    },
    statePlugins: {
      editor: {
        wrapActions: {
          detectContentTypeSuccess: detectContentTypeSuccessWrap,
        },
      },
      editorPreviewADS: {
        actions: {
          previewUnmounted,

          parse,
          parseStarted,
          parseSuccess,
          parseFailure,
        },
        selectors: {
          selectParseStatus,
          selectIsParseInProgress,
          selectIsParseSuccess,
          selectIsParseFailure,
          selectParseResult,
          selectParseError,
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
        },
        reducers,
      },
    },
  };
};

export default EditorPreviewApiDesignSystemsPlugin;
