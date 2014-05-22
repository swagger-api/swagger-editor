'use strict';

PhonicsApp.value('downloadHelper', {
  getZipFile: function getZipFile(url, json){
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: url,
      data: JSON.stringify(json),
      processData: false
    }).then(function(data){
      if (data instanceof Object && data.code){
        window.location = 'http://generator.wordnik.com/online/api/gen/download/' + data.code;
      }
    });
  }
});
