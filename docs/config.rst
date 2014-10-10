

Configuration
=============

Swagger editor is configured by the file `app/scripts/enums/default.js`.


Backends
--------

backendEndpoint
    Url to a backend which supports `GET` for retrieving a schema and `PUT` for saving it

useBackendForStorage
    Set to True to enable a backend

backendHelathCheckTimeout
    Timeout used when making healthchecks to the backend

    .. note::
        This healthcheck is actually hitting location.href, not the url
        specified by backendEndpoint

useYamlBackend
    Set to `true` if the backend expects Yaml, `false` will use JSON

    .. note::
        `Storage.save()` is only ever called with yaml so this probably does
        nothing if set to `false` 

Visual Style
------------

disableFileMenu
    Set to `true` to disable the editor menu

disableCodeGen
    unknown

headerBranding
    unknown

brandingCssClass
    css class to apply for branding


Examples
--------

examplesFolder
    Path to a directory with examples specs

exampleFiles
    List of files in `exampleFolder` that contain example specs


Misc
----

schemaUrl
    Url of the swagger spec schema
