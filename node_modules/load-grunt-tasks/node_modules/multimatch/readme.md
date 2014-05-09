# multimatch [![Build Status](https://travis-ci.org/sindresorhus/multimatch.png?branch=master)](http://travis-ci.org/sindresorhus/multimatch)

> Adds multiple patterns support to [`minimatch.match()`](https://github.com/isaacs/minimatch#minimatchmatchlist-pattern-options)


#### Comparison

Minimatch:

```js
minimatch.match(['unicorn', 'cake', 'rainbows'], '*corn');
```

Multimatch:

```js
multimatch(['unicorn', 'cake', 'rainbows'], ['*corn', 'rain*']);
```


## Install

Install with [npm](https://npmjs.org/package/multimatch)

```
npm install --save multimatch
```


## Usage

```js
var multimatch = require('multimatch');

multimatch(['unicorn', 'cake', 'rainbows'], ['!cake', '*corn']));
//=> ['unicorn', 'rainbows']
```

Patterns are additive while negations (eg `['foo', '!bar']`) are based on the current set. Exception is if the first pattern is negation, then it will get the full set, so to match user expectation (eg. `['!foo']` will match everything except `foo`). Order matters.

See the [tests](https://github.com/sindresorhus/multimatch/blob/master/test.js) for more usage examples and expected matches.


## API

Same as [`multimatch.match()`](https://github.com/isaacs/minimatch#minimatchmatchlist-pattern-options) except for `pattern` also accepting an array.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
