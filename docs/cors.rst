
CORS
====

If you want to import YAML or JSON resources from other hosts, those resources should
be served as `CORS-enabled resources <http://en.wikipedia.org/wiki/Cross-origin_resource_sharing>`_

For example, if you get an error such as
   {"data":"","status":0,"config":{"method":"GET","transformRequest":[null],"transformResponse":
   [null],"url":"http://www.example.com/swagger/apis/swagger.json","headers":{"accept":
   "application/x-yaml,text/yaml,application/json,*/*"}}}
this indicates the resource is not CORS-enabled.

By default, swagger-editor is configured to use a CORS-enabling
proxy deployed at https://cors-it.herokuapp.com

However, the cors-it.herokuapp.com proxy cannot access resources inside
an intranet. Thus, if you wish to import YAML or JSON
local resources, you should enable CORS for them
via a proxy that has access to those local resources.

Enabling CORS in local servers
------------------------------

The `swagger-core <https://github.com/swagger-api/swagger-core>`_ project documents one way to enable CORS for
intranet servers that you can moodify. See https://github.com/swagger-api/swagger-ui#cors-support.

CORS proxy
----------

Another linksway to enable CORS for importing YAML and JSON resources into
swagger-editor is to use a CORS-enabling proxy such
as `cors-it <https://github.com/mohsen1/cors-it>`_

To configure swagger-editor to use a local cors-it as a proxy,
update the setting of "importProxyUrl" in config/defaults.json

   "importProxyUrl": "http://yourhost:yourport/?url="

where yourhost and yourport reflect where you
have deployed your instance of cors-it.
