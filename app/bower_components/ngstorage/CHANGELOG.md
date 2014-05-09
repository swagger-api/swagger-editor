### 0.3.0 / 2013.10.16
* Remove the force overwrite on each cycle which has been causing inadvertent side effects such as breaking object references, changing `$$hashKey`s, or modifying user code behaviors.
* Add dirty-check debouncing. ([#2](https://github.com/gsklee/ngStorage/issues/2))
* Now incorporating Grunt to empower unit testing as well as uglification. ([#14](https://github.com/gsklee/ngStorage/issues/14))
* A few bugfixes, some of which are IE-only. ([#9](https://github.com/gsklee/ngStorage/issues/9), [#10](https://github.com/gsklee/ngStorage/issues/10), [#11](https://github.com/gsklee/ngStorage/issues/11))

---

### 0.2.3 / 2013.08.26
* Fix dependency version definitions in `bower.json`.

---

### 0.2.2 / 2013.08.09
* Add explicit DI annotation. ([#5](https://github.com/gsklee/ngStorage/issues/5))
* Fix an error in IE9 when Web Storage is empty. ([#8](https://github.com/gsklee/ngStorage/issues/8))
* Use the standard `addEventListener()` instead of jqLite's `bind()` to avoid the jQuery-specific `event.originalEvent`. ([#6](https://github.com/gsklee/ngStorage/issues/6))

---

### 0.2.1 / 2013.07.24
* Improve compatibility with existing Web Storage data using `ngStorage-` as the namespace. ([#3](https://github.com/gsklee/ngStorage/issues/3), [#4](https://github.com/gsklee/ngStorage/issues/4))

---

### 0.2.0 / 2013.07.19
* ***BREAKING CHANGE:*** `$clear()` has been replaced by `$reset()` and now accepts an optional parameter as the default content after reset.
* Add `$default()` to make default value binding easier.
* Data changes in `$localStorage` now propagate to different browser tabs.
* Improve compatibility with existing Web Storage data. ([#1](https://github.com/gsklee/ngStorage/issues/1))
* Properties being hooked onto the services with a `$` prefix are considered to belong to AngularJS inner workings and will no longer be written into Web Storage.

---

### 0.1.0 / 2013.07.07
* Initial release.
