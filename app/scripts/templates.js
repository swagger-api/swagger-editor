angular.module('SwaggerEditor').run(['$templateCache', function($templateCache) {  'use strict';

  $templateCache.put('templates/about.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">About Swagger Editor</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>Swagger Editor</p>\n" +
    "  <p>Version 2.8.x</p>\n" +
    "  <p><a href=\"https://github.com/swagger-api/swagger-editor\" target=\"_blank\">Github Project Page</a></p>\n" +
    "  <div class=\"monospace\">\n" +
    "    <p>\n" +
    "      Licensed under the Apache License, Version 2.0 (the \"License\");\n" +
    "      you may not use this file except in compliance with the License.\n" +
    "      You may obtain a copy of the License at <a href=\"http://www.apache.org/licenses/LICENSE-2.0\">apache.org/licenses/LICENSE-2.0</a></p>\n" +
    "    <p>\n" +
    "      Unless required by applicable law or agreed to in writing, software\n" +
    "      distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
    "      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
    "      See the License for the specific language governing permissions and\n" +
    "      limitations under the License.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"close()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/auth/api-key.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">API Key Authentication</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form role=\"form\" class=\"form-horizontal\" ng-submit=\"authenticate(apiKey)\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-3\">API Key</label>\n" +
    "      <div class=\"col-sm-9\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"key\" ng-model=\"apiKey\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"authenticate(apiKey)\" ng-disabled=\"!apiKey\">Authenticate</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/auth/basic.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">HTTP Basic Authentication</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form role=\"form\" class=\"form-horizontal\" ng-submit=\"authenticate(username, password)\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-3\">User Name</label>\n" +
    "      <div class=\"col-sm-9\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"User Name\" ng-model=\"username\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-3\">Password</label>\n" +
    "      <div class=\"col-sm-9\">\n" +
    "        <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"password\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"authenticate(username, password)\" ng-disabled=\"!username || !password\">Authenticate</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/auth/oauth2.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">OAuth 2.0 Authentication</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>Please follow OAuth flow, copy access token from OAuth and paste it here.</p>\n" +
    "  <form role=\"form\" class=\"form-horizontal\" ng-submit=\"authenticate(accessToken)\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-3\">Access Token</label>\n" +
    "      <div class=\"col-sm-9\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"access_token\" ng-model=\"accessToken\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"authenticate(accessToken)\" ng-disabled=\"!accessToken\">Authenticate</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/code-gen-error-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Code Generator Error</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>{{data.message}}</p>\n" +
    "  <p>Details:</p>\n" +
    "  <json-formatter json=\"data\" class=\"json-formatter-dark\"></json-formatter>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">OK</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/error-presenter.html',
    "<div class=\"error-presenter {{isOnlyWarnings() ? 'warning' : 'error'}}\" ng-controller=\"ErrorPresenterCtrl\">\n" +
    "  <header class=\"error-header\" ng-click=\"toggleCollapse()\">\n" +
    "    <h4>{{getTitle()}}</h4>\n" +
    "    <span class=\"collapse-button\">{{isCollapsed ? 'Open' : 'Collapse'}}</span>\n" +
    "  </header>\n" +
    "  <div ng-repeat=\"error in getErrors()\" collapse-when=\"isCollapsed\" class=\"item\">\n" +
    "    <h5 class=\"{{isWarning(error) ? 'warning' : 'error'}}\">\n" +
    "      <span class=\"icon\">{{isWarning(error) ? '⚠' : '✖' }}</span>\n" +
    "      {{getType(error)}}\n" +
    "    </h5>\n" +
    "    <p class=\"error-description\">\n" +
    "      <span>{{getDescription(error)}}</span>\n" +
    "    </p>\n" +
    "    <a ng-click=\"goToLineOfError(error)\" ng-if=\"mode === 'edit' && showLineJumpLink(error)\">Jump to line {{getLineNumber(error)}}</a>\n" +
    "    <h6>Details</h6>\n" +
    "    <json-formatter json=\"error\" open=\"0\"></json-formatter>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/file-import.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Import a File</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>YAML or JSON formats are accepted</p>\n" +
    "  <input on-read-file=\"fileChanged($fileContent)\" type=\"file\" ng-model=\"file\">\n" +
    "  <p class=\"invalid\" ng-if=\"isInvalidFile()\">Invalid File. Please use YAML or JSON.</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"isInvalidFile() || !isFileSelected()\">Import</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/import.html',
    "<div class=\"modal-header\">\n" +
    "<h3 class=\"modal-title\">Import a File</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>YAML or JSON formats are accepted</p>\n" +
    "  <input on-read-file=\"fileChanged($fileContent)\" type=\"file\" ng-model=\"file\">\n" +
    "  <p class=\"invalid\" ng-if=\"isInvalidFile()\">Invalid File. Please use YAML or</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"isInvalidFile() || !isFileSelected()\">Import</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/intro.html',
    "<div class=\"about-pane\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h1 class=\"overlay-title\">API Design First Workflow</h1>\n" +
    "    <h3>Easily create API specifications</h3>\n" +
    "  </div>\n" +
    "   <div class=\"file-arrow\"></div>\n" +
    "  <div class=\"sample\">Try a sample here</div>\n" +
    "  <button id=\"dismis-intro\" class=\"btn btn-warning btn-close\" ng-click=\"toggleAboutEditor(false)\">\n" +
    "  </button>\n" +
    "  <div class=\"yaml-author\">Write API specs in YAML...</div>\n" +
    "  <div class=\"sw-preview\">...Preview documentation in Swagger</div>\n" +
    "  <button class=\"btn btn-warning btn-intro\" ng-click=\"toggleAboutEditor(false)\">Got it!</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/open-examples.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Open An Example File</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>Pick one of the examples</p>\n" +
    "  <select ng-options=\"file for file in files\" ng-model=\"selectedFile\" autofocus></select>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"open(selectedFile)\">Open</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/operation.html',
    "<li class=\"{{operation.operationName | lowercase}} operation\" scroll-into-view-when=\"isInFocus(['paths', path.pathName, operation.operationName])\">\n" +
    "  <header ng-click=\"toggle(['paths', path.pathName, operation.operationName])\">\n" +
    "    <a class=\"focus-editor\" ng-click=\"focusEdit($event, ['paths', path.pathName, operation.operationName])\" ng-if=\"mode === 'preview'\" tooltip-placement=\"left\" tooltip=\"Jump to YAML\"></a>\n" +
    "    <div class=\"http-method\" class=\"toggleOperation\">{{operation.operationName | uppercase}} {{path.pathName}}</div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"content\" collapse-when=\"isCollapsed(['paths', path.pathName, operation.operationName])\">\n" +
    "    <div class=\"tags\">\n" +
    "      <span class=\"tag tag-color-{{tagIndexFor(tag)}}\" ng-repeat=\"tag in operation.tags\">{{tag}}</span>\n" +
    "    </div>\n" +
    "    <section class=\"summary\" ng-if=\"operation.summary\">\n" +
    "      <h4>Summary</h4>\n" +
    "      <p>{{operation.summary}}</p>\n" +
    "    </section>\n" +
    "    <section class=\"description\" ng-if=\"operation.description\">\n" +
    "      <h4>Description</h4>\n" +
    "      <div marked=\"operation.description\"></div>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"parameters\" ng-if=\"getParameters().length\">\n" +
    "      <h4>Parameters</h4>\n" +
    "      <div>\n" +
    "        <table class=\"params\">\n" +
    "          <thead>\n" +
    "            <tr>\n" +
    "              <th>Name</th>\n" +
    "              <th>Located in</th>\n" +
    "              <th>Description</th>\n" +
    "              <th>Required</th>\n" +
    "              <th>Schema</th>\n" +
    "            </tr>\n" +
    "          </thead>\n" +
    "          <tbody>\n" +
    "            <tr ng-repeat=\"parameter in getParameters() track by $index\">\n" +
    "              <td>\n" +
    "                <a ng-click=\"focusEdit($event, ['paths', path.pathName, operation.operationName, 'parameters', $index], -1)\">\n" +
    "                  <span class=\"mono\">{{parameter.name}}</span>\n" +
    "                </a>\n" +
    "              </td>\n" +
    "              <td>{{parameter.in}}</td>\n" +
    "              <td marked=\"parameter.description\"></td>\n" +
    "              <td>{{parameter.required ? 'Yes' : 'No'}}</td>\n" +
    "              <td>\n" +
    "                <schema-model schema=\"getParameterSchema(parameter)\"></schema-model>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "          </tbody>\n" +
    "        </table>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"responses\" ng-if=\"operation.responses\">\n" +
    "      <h4>Responses</h4>\n" +
    "      <div>\n" +
    "        <table class=\"respns\">\n" +
    "          <thead>\n" +
    "            <tr>\n" +
    "              <th>Code</th>\n" +
    "              <th>Description</th>\n" +
    "              <th>Schema</th>\n" +
    "            </tr>\n" +
    "          </thead>\n" +
    "          <tbody>\n" +
    "            <tr ng-repeat=\"response in operation.responses\">\n" +
    "              <td>\n" +
    "                <a ng-click=\"focusEdit($event, ['paths', path.pathName, operation.operationName, 'responses', response.responseCode])\">\n" +
    "                  <span class=\"resp-code {{responseCodeClassFor(response.responseCode)}}\">{{response.responseCode}}</span>\n" +
    "                </a>\n" +
    "              </td>\n" +
    "              <td>{{response.description}}</td>\n" +
    "              <td>\n" +
    "                <schema-model schema=\"response.schema\"></schema-model>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "          </tbody>\n" +
    "        </table>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"security\" ng-if=\"operation.security\">\n" +
    "      <h4>Security</h4>\n" +
    "      <table class=\"security\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Security Schema</th>\n" +
    "            <th>Scopes</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr ng-repeat=\"security in operation.security\">\n" +
    "            <td ng-repeat=\"(securityName, securityValues) in security\">{{securityName}}</td>\n" +
    "            <td ng-repeat=\"(securityName, securityValues) in security\">\n" +
    "              <strong class=\"security-value\" ng-repeat=\"value in securityValues\">{{value}}</strong>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"try-operation\" ng-if=\"enableTryIt\">\n" +
    "      <button class=\"border-only try-it\" ng-class=\"{trying: isTryOpen}\" ng-click=\"toggleTry()\" ng-if=\"!isTryOpen\" track-event=\"try-operation\">Try this operation</button>\n" +
    "      <button class=\"border-only red close-try\" ng-class=\"{'is-open': isTryOpen}\" ng-click=\"toggleTry()\" ng-if=\"isTryOpen\">Close</button>\n" +
    "      <div ng-include=\"'templates/try-operation.html'\" ng-if=\"isTryOpen\"></div>\n" +
    "    </section>\n" +
    "</div></li>"
  );


  $templateCache.put('templates/paste-json.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Paste Swagger JSON</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Swagger JSON</label>\n" +
    "    <textarea class=\"form-control\" cols=\"30\" rows=\"10\" ng-model=\"json\" ng-change=\"checkJSON(json)\"></textarea>\n" +
    "  </div>\n" +
    "  <div ng-if=\"error\">\n" +
    "    Error\n" +
    "    <json-formatter class=\"error json-formatter-dark\" json=\"error\" open=\"2\"></json-formatter>\n" +
    "  </div>\n" +
    "  <p class=\"can-import\" ng-if=\"canImport\">✔ Valid Swagger</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"!canImport\">Import</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/path.html',
    "<li class=\"path\">\n" +
    "  <header ng-click=\"$parent.toggle(['paths', path.pathName])\">\n" +
    "    <h2>\n" +
    "      <a>{{path.pathName}}</a>\n" +
    "    </h2>\n" +
    "    <span class=\"on-hover\">\n" +
    "      <a ng-click=\"toggleAll(['paths', path.pathName])\" ng-hide=\"isAllFolded(['paths', path.pathName]) || isCollapsed(['paths', path.pathName])\" stop-event>List all operations</a>\n" +
    "    </span>\n" +
    "    <a class=\"jump-to-yaml\" ng-click=\"focusEdit($event, ['paths', path.pathName]) \" tooltip-placement=\"left\" tooltip=\"Jump to YAML\"></a>\n" +
    "  </header>\n" +
    "  <ul class=\"operations\" collapse-when=\"$parent.isCollapsed(['paths', path.pathName])\">\n" +
    "    <operation ng-repeat=\"operation in path.operations\" ng-if=\"!isVendorExtension(operation.operationName)\"></operation>\n" +
    "  </ul>\n" +
    "</li>"
  );


  $templateCache.put('templates/schema-model.html',
    "<div class=\"schema-model\" ng-class=\"{hidden: !schema}\">\n" +
    "  <header>\n" +
    "    <a ng-click=\"mode = 'json'\" ng-class=\"{active: mode === 'model'}\">JSON</a> <span ng-class=\"{active: mode === 'json'}\">JSON</span>\n" +
    "    <span class=\"active pipe\">|</span>\n" +
    "    <a ng-click=\"mode = 'model'\" ng-class=\"{active: mode === 'json'}\">Model</a> <span ng-class=\"{active: mode === 'model'}\">Model</span>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"json animate-if\" ng-if=\"mode === 'json'\">\n" +
    "    <json-formatter json=\"json\" open=\"1\"></json-formatter>\n" +
    "  </section>\n" +
    "  <section class=\"model animate-if\" ng-if=\"mode === 'model'\">\n" +
    "    <json-schema-view schema=\"json\" open=\"0\"></json-schema-view>\n" +
    "  </section>\n" +
    "</div>"
  );


  $templateCache.put('templates/security.html',
    "<div class=\"security\" ng-controller=\"SecurityCtrl\">\n" +
    "  <header>\n" +
    "    <h3 class=\"section-header\">\n" +
    "      <a ng-click=\"toggle(['security'])\">Security</a>\n" +
    "    </h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"security-definitions\" collapse-when=\"isCollapsed(['security'])\">\n" +
    "    <div ng-repeat=\"(securityDefinitionName, securityDefinition) in specs.securityDefinitions\" class=\"security-definition {{securityDefinition.type}}\">\n" +
    "      <header>\n" +
    "        <h4>\n" +
    "          <span class=\"authenticated\" style=\"color:green\" ng-if=\"isAuthenticated(securityDefinitionName)\" title=\"Authenticated\">✓</span>\n" +
    "          <span>{{securityDefinitionName}}</span>\n" +
    "          <span class=\"security-type\">({{getHumanSecurityType(securityDefinition.type)}})</span>\n" +
    "          <div class=\"authentication\">\n" +
    "            <div>\n" +
    "              <button ng-click=\"authenticate(securityDefinitionName, securityDefinition)\" class=\"authenticate\">{{isAuthenticated(securityDefinitionName) ? 'Change Authentication' : 'Authenticate'}}</button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </h4>\n" +
    "      </header>\n" +
    "      <section>\n" +
    "        <p ng-if=\"securityDefinition.description\" marked=\"securityDefinition.description\"></p>\n" +
    "\n" +
    "        <table class=\"table\">\n" +
    "          <tbody>\n" +
    "            <tr ng-if=\"securityDefinition.name\">\n" +
    "              <td>Name</td>\n" +
    "              <td>{{securityDefinition.name}}</td>\n" +
    "            </tr>\n" +
    "            <tr ng-if=\"securityDefinition.in\">\n" +
    "              <td>In</td>\n" +
    "              <td>{{securityDefinition.in}}</td>\n" +
    "            </tr>\n" +
    "            <tr ng-if=\"securityDefinition.flow\">\n" +
    "              <td>Flow</td>\n" +
    "              <td>{{securityDefinition.flow}}</td>\n" +
    "            </tr>\n" +
    "            <tr ng-if=\"securityDefinition.authorizationUrl\">\n" +
    "              <td>Authorization URL</td>\n" +
    "              <td><a target=\"_blank\" href=\"{{securityDefinition.authorizationUrl}}\">{{securityDefinition.authorizationUrl}}</a></td>\n" +
    "            </tr>\n" +
    "            <tr ng-if=\"securityDefinition.tokenUrl\">\n" +
    "              <td>Authorization URL</td>\n" +
    "              <td><a target=\"_blank\" href=\"{{securityDefinition.tokenUrl}}\">{{securityDefinition.tokenUrl}}</a></td>\n" +
    "            </tr>\n" +
    "          </tbody>\n" +
    "        </table>\n" +
    "        <h4 ng-if=\"securityDefinition.scopes\">Scopes</h4>\n" +
    "        <table ng-if=\"securityDefinition.scopes\">\n" +
    "          <tbody>\n" +
    "            <tr ng-repeat=\"(scopeName, scope) in securityDefinition.scopes\" class=\"scopes-table\">\n" +
    "              <td><strong>{{scopeName}}</strong></td>\n" +
    "              <td>{{scope}}</td>\n" +
    "            </tr>\n" +
    "          </tbody>\n" +
    "        </table>\n" +
    "      </section>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/specs-info.html',
    "<div class=\"info\">\n" +
    "  <header class=\"info-header\">\n" +
    "    <h3 class=\"section-header\">\n" +
    "      <a ng-click=\"toggle(['info'])\">{{specs.info.title}}</a>\n" +
    "    </h3>\n" +
    "    <!-- Commented out because of CSS issues (looks bad)\n" +
    "    <div class=\"collapse-togglers\">\n" +
    "      <button type=\"button\" class=\"btn btn-default left\" ng-click=\"toggleAllPathsListed()\"\n" +
    "        ng-class=\"{active: areAllPathsListed()}\">All</button>\n" +
    "      <button type=\"button\" class=\"btn btn-default left\"></button>\n" +
    "      <button type=\"button\" class=\"btn btn-default left\"></button>\n" +
    "    </div>\n" +
    "    -->\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"info-container section-content\" collapse-when=\"isCollapsed(['info'])\" ng-ani>\n" +
    "    <div marked=\"specs.info.description\"></div>\n" +
    "    <h4>Version <span>{{specs.info.version}}</span></h4>\n" +
    "    <div ng-if=\"specs.info.termsOfService\">\n" +
    "      <h4>Terms of service</h4>\n" +
    "      <p>{{specs.info.termsOfService}}</p>\n" +
    "    </div>\n" +
    "    <div ng-if=\"license\">\n" +
    "      <h4>{{specs.info.license.name}}</h4>\n" +
    "      <a href=\"{{specs.info.license.url}}\">{{specs.info.license.url}}</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/tags.html',
    "<div class=\"root tags\">\n" +
    "  <div class=\"filtered\" ng-if=\"stateParams.tags\">\n" +
    "    <p>Showing only operations with following tag{{getCurrentTags().length === 1 ? '' : 's'}}:</p>\n" +
    "    <span class=\"tag tag-color-{{tagIndexFor(tag)}}\" ng-repeat=\"tag in getCurrentTags()\">{{tag}}\n" +
    "      <a class=\"delete-tag\" ui-sref=\"{tags: ''}\">×</a>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"all-tags\" ng-if=\"!stateParams.tags && getAllTags().length\">\n" +
    "    <p>Filter operations by a tag:</p>\n" +
    "    <a class=\"tag tag-color-{{tagIndexFor(tag.name)}}\" ui-sref=\"{tags: tag.name}\" ng-repeat=\"tag in getAllTags()\" title=\"{{tag.description}}\">{{tag.name}}</a>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/try-operation.html',
    "<div ng-controller=\"TryOperation\">\n" +
    "  <h4>Request</h4>\n" +
    "  <div class=\"request\">\n" +
    "    <tabset justified=\"true\">\n" +
    "      <tab heading=\"Form\" select=\"setInputMode('form')\">\n" +
    "        <div class=\"parameters\" ng-repeat=\"parameter in parameters\">\n" +
    "          <form sf-schema=\"parameter.schema\" sf-form=\"parameter.form\" sf-model=\"parameter.model\"></form>\n" +
    "        </div>\n" +
    "      </tab>\n" +
    "      <tab heading=\"Raw\" select=\"setInputMode('raw')\" ng-if=\"hasBodyParam()\">\n" +
    "        <div class=\"raw-model\" ng-model=\"$parent.rawModel\" ui-ace=\"{theme:'github', mode: 'json', onChange: rawChanged}\"></div>\n" +
    "      </tab>\n" +
    "    </tabset>\n" +
    "\n" +
    "    <table class=\"options-table\">\n" +
    "      <tbody>\n" +
    "        <tr ng-if=\"specs.schemes\">\n" +
    "          <td><label>Scheme</label></td>\n" +
    "          <td>\n" +
    "             <select ng-model=\"$parent.scheme\" ng-init=\"$parent.scheme = walkToProperty('schemes')[0]\" ng-options=\"o as o for o in walkToProperty('schemes')\"></select>\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr ng-if=\"hasBodyParam()\">\n" +
    "          <td><label>Content Type</label></td>\n" +
    "          <td>\n" +
    "            <select ng-model=\"$parent.contentType\" ng-init=\"$parent.contentType = 'multipart/form-data'\">\n" +
    "              <option value=\"multipart/form-data\">multipart/form-data</option>\n" +
    "              <option value=\"application/x-www-form-urlencoded\">application/x-www-form-urlencoded</option>\n" +
    "              <option value=\"application/json\">application/json</option>\n" +
    "            </select>\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr ng-if=\"walkToProperty('consumes').length\">\n" +
    "          <td><label>Accept</label></td>\n" +
    "          <td>\n" +
    "            <select ng-model=\"$parent.accepts\" ng-options=\"o as o for o in walkToProperty('consumes')\" ng-init=\"$parent.accepts = walkToProperty('consumes')[0]\"></select>\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td><label>Security</label></td>\n" +
    "          <td>\n" +
    "            <select ng-model=\"$parent.selectedSecurity\" ng-init=\"$parent.selectedSecurity = getSecuirtyOptions()[0]\">\n" +
    "              <option ng-repeat=\"option in getSecuirtyOptions()\" value=\"{{option}}\" ng-disabled=\"!$parent.securityIsAuthenticated(option)\">\n" +
    "                {{option + (!$parent.securityIsAuthenticated(option) ? ' (Not authenticated)' : '')}}\n" +
    "              </option>\n" +
    "            </select>\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "    <div class=\"raw-request raw\">\n" +
    "      <div class=\"line url\">\n" +
    "        {{operation.operationName | uppercase}}\n" +
    "        <a href=\"{{generateUrl()}}\" target=\"_blank\">{{generateUrl()}}</a>\n" +
    "        {{httpProtorcol}}\n" +
    "      </div>\n" +
    "      <div class=\"headers\">\n" +
    "        <div class=\"header\" ng-repeat=\"(headerName, headerValue) in getHeaders()\">\n" +
    "        <strong>{{headerName}}</strong>: {{headerValue}}</div>\n" +
    "      </div>\n" +
    "      <pre ng-if=\"hasBodyParam()\" class=\"json-body\">{{getRequestBody()}}</pre>\n" +
    "    </div>\n" +
    "    <button ng-click=\"makeCall()\" class=\"{{$parent.operationName}} call\" ng-disabled=\"xhrInProgress\">\n" +
    "      <span ng-if=\"xhrInProgress\">Sending...</span>\n" +
    "      <span ng-if=\"!xhrInProgress\">Send Request</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "\n" +
    "  <h4>Response</h4>\n" +
    "  <div class=\"response\" ng-if=\"xhr\">\n" +
    "    <div class=\"response-info\" ng-class=\"{error: error}\">\n" +
    "      <span class=\"status-text\">{{textStatus | uppercase}}</span>\n" +
    "      <span ng-if=\"error\">{{error}}</span>\n" +
    "    </div>\n" +
    "    <tabset justified=\"true\" class=\"responses-tabs\">\n" +
    "      <tab heading=\"Rendered\">\n" +
    "        <h6>Headers</h6>\n" +
    "        <json-formatter json=\"responseHeaders\" open=\"3\"></json-formatter>\n" +
    "        <h6>Body</h6>\n" +
    "        <json-formatter ng-if=\"isJson(responseData)\" json=\"responseData\" open=\"3\"></json-formatter>\n" +
    "        <div ng-if=\"isHTML(responseData)\" ng-bind-html=\"responseData\"></div>\n" +
    "        <div ng-if=\"isPlain(responseData)\">\n" +
    "          {{responseData}}\n" +
    "        </div>\n" +
    "      </tab>\n" +
    "      <tab heading=\"Pretty\">\n" +
    "        <pre>{{prettyPrint(xhr.responseText)}}</pre>\n" +
    "      </tab>\n" +
    "      <tab heading=\"Raw\">\n" +
    "        <div class=\"raw-response raw\">\n" +
    "          <div class=\"status\">{{httpProtorcol}} {{xhr.statusCode}} {{statusText}}</div>\n" +
    "          <div class=\"resp-headers\">{{xhr.getAllResponseHeaders()}}</div>\n" +
    "          <div>{{xhr.responseText}}</div>\n" +
    "        </div>\n" +
    "      </tab>\n" +
    "    </tabset>\n" +
    "    </div>\n" +
    "  </div>\n"
  );


  $templateCache.put('templates/url-import.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Import From URL</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"url\">URL</label>\n" +
    "    <input type=\"text\" class=\"form-control\" autofocus=\"true\" ng-model=\"url\" ng-blur=\"fetch(url)\">\n" +
    "  </div>\n" +
    "  <p class=\"error\" ng-if=\"error\">{{error}}</p>\n" +
    "  <p class=\"can-import\" ng-if=\"canImport\">✔ Valid URL</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"!canImport\">Import</button>\n" +
    "</div>"
  );


  $templateCache.put('views/editor/editor.html',
    "<div class=\"editor-wrapper\" ng-model=\"$root.editorValue\" ui-ace=\"{\n" +
    "  useWrapMode : true,\n" +
    "  mode: 'yaml',\n" +
    "  onLoad: aceLoaded,\n" +
    "  onChange: aceChanged}\">\n" +
    "</div>"
  );


  $templateCache.put('views/header/header.html',
    "<div class=\"main-header\">\n" +
    "  <div ng-if=\"showAbout\" ng-include=\"'templates/intro.html'\"></div>\n" +
    "  <a href=\"http://swagger.io\" target=\"_blank\" class=\"logo\" ng-if=\"!showHeaderBranding()\"></a>\n" +
    "  <div ng-include=\"'templates/branding-left.html'\" ng-if=\"showHeaderBranding()\" class=\"branding-3rdparty\"></div>\n" +
    "  <section class=\"menu-bar\">\n" +
    "    <div class=\"file dropdown\" ng-if=\"showFileMenu()\">\n" +
    "      <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" id=\"fileMenu\" ng-mouseover=\"assignDownloadHrefs()\">File\n" +
    "        <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" ng-if=\"showFileMenu()\" role=\"menu\" aria-labelledby=\"fileMenu\">\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"newProject()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file new\">New</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"newProject(true)\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file blank\">Blank Project</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"openExamples()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file open-example\">Open Example&hellip;</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"openPasteJSON()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file paste-json\">Paste JSON&hellip;</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"openImportUrl()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file import url\">Import URL&hellip;</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"openImportFile()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file import file\">Import File&hellip;</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a download=\"swagger.yaml\" data-downloadurl=\"{{yamlDownloadUrl}}\" href=\"{{yamlDownloadHref}}\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file download yaml\">Download YAML</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a download=\"swagger.json\" downloadurl=\"{{jsonDownloadUrl}}\" href=\"{{jsonDownloadHref}}\" role=\"menuitem\" tabindex=\"-1\" track-event=\"file download json\">Download JSON</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"preferences dropdown\">\n" +
    "      <button id=\"preferences\" class=\"btn btn-default dropdown-toggle\">\n" +
    "        Preferences\n" +
    "        <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"preferences\">\n" +
    "        <li role=\"presentation\">\n" +
    "          <a class=\"font-size\">\n" +
    "            Font Size\n" +
    "            <span ng-click=\"adjustFontSize(1)\" stop-event class=\"adjust\" track-event=\"preferences font+\">+</span><span ng-click=\"adjustFontSize(-1)\" stop-event class=\"adjust\" track-event=\"preferences font-\">–</span>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"openEditorPreferences()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"preferences settings\">Settings</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"resetSettings()\" role=\"menuitem\" tabindex=\"-1\" track-event=\"preferences reset-settings\">Reset Settings</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"mode dropdown\">\n" +
    "      <button id=\"switch-mode\" class=\"btn btn-default dropdown-toggle\">\n" +
    "        Mode\n" +
    "        <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"switch-mode\">\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ui-sref=\"{mode: 'edit'}\" role=\"menuitem\" tabindex=\"-1\" id=\"edit-mode\" track-event=\"mode edit\">Editor</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" stop-event id=\"design-mode\" ng-click=\"designModeTodoAlert()\" track-event=\"mode designer\">Designer</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ui-sref=\"{mode: 'preview'}\" role=\"menuitem\" tabindex=\"-1\" id=\"preview-mode\" track-event=\"mode preview\">Preview</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\" class=\"divider\" ng-if=\"showEditorMenuOptions()\"></li>\n" +
    "        <li role=\"presentation\" ng-if=\"showEditorMenuOptions()\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"toggleLiveRender()\" track-event=\"mode toggle-live-render {{isLiveRenderEnabled()}}\">{{isLiveRenderEnabled() ? 'Disable' : 'Enable'}} Live Render</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"dropdown\" ng-if=\"servers && !disableCodeGen\">\n" +
    "       <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" id=\"ServerMenu\">\n" +
    "        Get Servers\n" +
    "        <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"ServerMenu\">\n" +
    "        <li ng-repeat=\"server in servers\" role=\"presentation\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"getServer(server)\">{{server}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"code-gen dropdown\" ng-if=\"clients && !disableCodeGen\">\n" +
    "       <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" id=\"ClientMenu\">\n" +
    "        Get Clients\n" +
    "        <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"ClientMenu\">\n" +
    "        <li ng-repeat=\"client in clients\" role=\"presentation\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"getClient(client)\">{{client}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"help dropdown\">\n" +
    "      <button class=\"dropdown-icon btn btn-default dropdown-toggle\" id=\"helpMenu\" data-toggle=\"dropdown\" type=\"button\">Help\n" +
    "      <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"helpMenu\">\n" +
    "        <li role=\"presentation\">\n" +
    "          <a href=\"https://github.com/swagger-api/swagger-editor/issues/new?labels=From%20Editor\" target=\"_blank\">Report A Bug</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" href=\"http://swagger.io/\" target=\"_blank\">Swagger Website</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"openAbout()\">About Swagger Editor</a>\n" +
    "        </li>\n" +
    "        <li role=\"presentation\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\">\n" +
    "          <a ng-click=\"toggleAboutEditor(true)\" role=\"menuitem\" tabindex=\"-1\">Show Introduction Help</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"status-bar\">\n" +
    "    <div ng-if=\"mode === 'preview'\" class=\"status {{statusClass}}\" ng-if=\"status\">\n" +
    "      <span class=\"icon\"></span>\n" +
    "      <span>{{status}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"brandRight\" ng-include=\"'templates/branding-right.html'\" ng-if=\"showHeaderBranding()\"></div>\n" +
    "  </section>\n" +
    "  </div>\n"
  );


  $templateCache.put('views/main-preview.html',
    "<header ui-view=\"header\" class=\"main-header\"></header>\n" +
    "<main class=\"preveiw-mode preview-wrapper\">\n" +
    "  <div ui-view=\"preview\"></div>\n" +
    "</main>"
  );


  $templateCache.put('views/main.html',
    "<header ui-view=\"header\"></header>\n" +
    "<main ng-class=\"{'preview-mode': mode === 'docs-only'}\">\n" +
    "  <div ui-layout=\"{ flow : 'column', dividerSize: '8px'}\">\n" +
    "    <div class=\"editor pane\" ui-layout-container>\n" +
    "      <div ui-view=\"editor\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"preview pane\" ui-layout-container>\n" +
    "      <div ui-view=\"preview\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</main>"
  );


  $templateCache.put('views/preview/preview.html',
    "<div class=\"preview-wrapper\">\n" +
    "  <div class=\"dirty-message\" ng-if=\"isDirty\">\n" +
    "    This preview is out of date. Please <a ng-click=\"loadLatest()\">reload</a> to see the latest.\n" +
    "  </div>\n" +
    "  <ng-include src=\"'templates/error-presenter.html'\" ng-if=\"errors || warnings\"></ng-include>\n" +
    "\n" +
    "  <ng-include src=\"'templates/specs-info.html'\" ng-if=\"!!specs.info && !error.yamlError\"></ng-include>\n" +
    "  <ng-include src=\"'templates/security.html'\" ng-if=\"specs.securityDefinitions\"></ng-include>\n" +
    "\n" +
    "  <header ng-if=\"!!specs.info && !error.yamlError\">\n" +
    "    <h3 class=\"section-header\">\n" +
    "      <a ng-click=\"toggle(['paths'])\">Paths</a>\n" +
    "      <span class=\"on-hover\">\n" +
    "        <a ng-click=\"toggleAll(['paths'])\" ng-hide=\"isAllFolded(['paths'])\">List all paths</a>\n" +
    "      </span>\n" +
    "    </h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <ng-include src=\"'templates/tags.html'\"></ng-include>\n" +
    "\n" +
    "  <ul class=\"paths\" ng-if=\"!error.yamlError\" collapse-when=\"isCollapsed(['paths'])\">\n" +
    "    <path ng-repeat=\"path in specs.paths\" ng-if=\"!isVendorExtension(path.pathName) && path.operations.length > 0\"></path>\n" +
    "  </ul>\n" +
    "\n" +
    "  <header ng-if=\"specs.definitions\">\n" +
    "    <h3 class=\"section-header\">\n" +
    "      <!-- <span class=\"arrow\">{{isCollapsed('definitions') ? '▶' : '▼'}}</span> -->\n" +
    "      <a ng-click=\"toggle(['definitions'])\">Models</a>\n" +
    "      <span class=\"on-hover\">\n" +
    "        <a ng-click=\"toggleAll(['definitions'])\" ng-hide=\"isAllFolded(['definitions'])\">List all models</a>\n" +
    "      </span>\n" +
    "    </h3>\n" +
    "  </header>\n" +
    "   <ul class=\"section-content definitions\" ng-if=\"specs.definitions\" collapse-when=\"isCollapsed(['definitions'])\" class=\"models\">\n" +
    "      <li class=\"definition\" ng-repeat=\"(modelName, model) in specs.definitions\" ng-if=\"!isVendorExtension(modelName)\" scroll-into-view-when=\"isInFocus(['definitions', modelName])\">\n" +
    "        <h4>\n" +
    "          <a ng-click=\"toggle(['definitions', modelName])\" class=\"definition-title\">{{modelName}}</a>\n" +
    "        </h4>\n" +
    "        <schema-model schema=\"model\" collapse-when=\"isCollapsed(['definitions', modelName])\"></schema-model>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "</div>"
  );
}]);