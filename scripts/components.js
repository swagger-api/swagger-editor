'use strict';
/*
 * A wrapper file that requires all different components.
 *
 * This file helps loading components easier in tests
*/

// Router
require('scripts/router');

// Services
require('scripts/services/analytics.js');
require('scripts/services/ast-manager.js');
require('scripts/services/auth-manager.js');
require('scripts/services/autocomplete.js');
require('scripts/services/backend.js');
require('scripts/services/builder.js');
require('scripts/services/codegen.js');
require('scripts/services/editor.js');
require('scripts/services/external-hooks.js');
require('scripts/services/fileloader.js');
require('scripts/services/focused-path.js');
require('scripts/services/fold-state-manager.js');
require('scripts/services/json-schema.js');
require('scripts/services/keyword-map.js');
require('scripts/services/local-storage.js');
require('scripts/services/preferences.js');
require('scripts/services/storage.js');
require('scripts/services/sway-worker.js');
require('scripts/services/tag-manager.js');
require('scripts/services/yaml.js');

// Controllers
require('scripts/controllers/editor.js');
require('scripts/controllers/errorpresenter.js');
require('scripts/controllers/general-modal.js');
require('scripts/controllers/header.js');
require('scripts/controllers/import-file.js');
require('scripts/controllers/importurl.js');
require('scripts/controllers/main.js');
require('scripts/controllers/modal.js');
require('scripts/controllers/openexamples.js');
require('scripts/controllers/paste-json.js');
require('scripts/controllers/preferences.js');
require('scripts/controllers/preview.js');
require('scripts/controllers/security.js');
require('scripts/controllers/confirm-reset.js');
require('scripts/controllers/tryoperation.js');

// Directives
require('scripts/directives/auto-focus.js');
require('scripts/directives/collapsewhen.js');
require('scripts/directives/on-file-change.js');
require('scripts/directives/operation.js');
require('scripts/directives/schemamodel.js');
require('scripts/directives/scroll-into-view-when.js');
require('scripts/directives/stop-event.js');
require('scripts/directives/track-event.js');

// Enums
require('scripts/enums/defaults.js');
require('scripts/enums/strings.js');

// Filter
require('scripts/filters/formdata.js');

// Plugins
require('scripts/plugins/jquery.scroll-into-view.js');

// Misc
require('scripts/ace/snippets/swagger.snippet.js');
require('scripts/analytics/google.js');

// Ace Editor
window.ace = require('brace');

