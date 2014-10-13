

Configuration
=============

Swagger editor is configured from the file ``app/scripts/enums/default.js``.


Backends
--------

backendEndpoint
    Url to a backend which supports ``GET`` for retrieving a swagger spec to edit
    and ``PUT`` for saving it.

useBackendForStorage
    Set to ``true`` to enable a backend.

backendHelathCheckTimeout
    Timeout in millseconds of the http request to healthchecks the backend

    .. note::
        This healthcheck is actually hitting location.href, not the url
        specified by backendEndpoint

useYamlBackend
    Set to ``true`` if the backend expects YAML, ``false`` will use JSON

    .. note::
        ``Storage.save()`` is only ever called with yaml so this probably does
        nothing if set to ``false`` 

Visual Style
------------

disableFileMenu
    Set to ``true`` to disable the editor menu

headerBranding
    Include the contents of ``app/templates/branding-left.html`` and
    ``app/templates/branding-right.html`` in the header.

brandingCssClass
    css class to apply to the body tag

    .. warning::
        This setting is deprecated, it will be removed in a future release.


Code Generation
---------------

disableCodeGen
    Set to ``true`` to hide codegen links for clients and servers.

codegen
    An object with keys ``servers``, ``clients``, ``server``, and ``client``. Each of
    with is a url to (TODO: to what?)


Examples
--------

examplesFolder
    Path to a directory with examples specs

exampleFiles
    List of files in ``exampleFolder`` that contain example specs. The first file
    is used as the default document for the editor when it is opened.


Swagger Validation
------------------

schemaUrl
    Url of the swagger spec schema, defaults to the schema provided in
    ``app/scripts/enums/swagger-json-schema.js``.
