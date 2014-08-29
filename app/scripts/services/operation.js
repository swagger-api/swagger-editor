'use strict';

PhonicsApp.service('Operation', function Operation() {

  /*
  ** get a subpath for edit
  */
  this.getEditPath = function (pathName) {
    return '#/paths?path=' + window.encodeURIComponent(pathName);
  };

  /*
  ** Response CSS class for an HTTP response code
  */
  this.responseCodeClassFor = function (code) {
    var result = 'default';
    switch (Math.floor(+code / 100)) {
      case 2:
        result = 'green';
        break;
      case 5:
        result = 'red';
        break;
      case 4:
        result = 'yellow';
        break;
      case 3:
        result = 'blue';
    }
    return result;
  };

  /*
  ** Determines if a key is a vendor extension key
  ** Vendor extensions always start with `x-`
  */
  this.isVendorExtension = function (key) {
    return key.substring(0, 2).toLowerCase() === 'x-';
  };

});
