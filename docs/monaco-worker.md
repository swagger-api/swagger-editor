Monaco Client (React)
  - setup a Monaco instance
    - setup monaco environment use of language worker(s) to use
    - instantiate web workers
    - register providers via Adapters
  - create a Monaco instance
Adapter
  - an adapter for each service or provider
  - generally expect a `provide[Description]` method that matches monaco interface
  - offloads language service functions to language web worker
  - run and/or return a monaco editor "effect". e.g. hover, completion, based on web worker result
  - not required to use Typescript
WebWorker
  - called via an adapter
  - call a language service method in separate thread
  - recommended use by Monaco
LanguageService
  - called via a web worker
  - any lib, in our case, apidom
  - examples include typescript/javascript, json, css


notes:
- some minor naming differences across libs
