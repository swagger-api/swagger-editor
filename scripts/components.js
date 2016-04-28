'use strict';
/*
 * A wrapper file that requires all different components.
 *
 * This file helps loading components easier in tests
*/

// Configurations
require('./config/app.config.js');

// Router
require('./router');

// Services
require('./services/analytics.js');
require('./services/ast-manager.js');
require('./services/auth-manager.js');
require('./services/autocomplete.js');
require('./services/backend.js');
require('./services/builder.js');
require('./services/codegen.js');
require('./services/editor.js');
require('./services/external-hooks.js');
require('./services/fileloader.js');
require('./services/focused-path.js');
require('./services/fold-state-manager.js');
require('./services/keyword-map.js');
require('./services/local-storage.js');
require('./services/preferences.js');
require('./services/storage.js');
require('./services/sway-worker.js');
require('./services/tag-manager.js');
require('./services/yaml.js');

// Controllers
require('./controllers/editor.js');
require('./controllers/errorpresenter.js');
require('./controllers/general-modal.js');
require('./controllers/header.js');
require('./controllers/import-file.js');
require('./controllers/importurl.js');
require('./controllers/main.js');
require('./controllers/modal.js');
require('./controllers/openexamples.js');
require('./controllers/paste-json.js');
require('./controllers/preferences.js');
require('./controllers/preview.js');
require('./controllers/security.js');
require('./controllers/confirm-reset.js');

// Directives
require('./directives/auto-focus.js');
require('./directives/collapsewhen.js');
require('./directives/on-file-change.js');
require('./directives/operation.js');
require('./directives/schemamodel.js');
require('./directives/scroll-into-view-when.js');
require('./directives/stop-event.js');
require('./directives/track-event.js');
require('./directives/tryoperation.js');

// Enums
require('./enums/defaults.js');
require('./enums/strings.js');

// Filter
require('./filters/formdata.js');

// Plugins
require('./plugins/jquery.scroll-into-view.js');

// Misc
require('./ace/snippets/swagger.snippet.js');
require('./analytics/google.js');

// Ace Editor
window.ace = require('brace');

