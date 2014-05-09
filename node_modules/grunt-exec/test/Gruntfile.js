module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      test1: {
        cmd: 'echo "bruce willis was dead" > test1'
      }
    , test2: {
        cmd: function() { return 'echo "grunt@' + this.version + '" > test2'; }
      }
    , test3: {
        cmd: function(answerToLife, tacoThoughts) {
          var text = [
            'the answer to life is ' + answerToLife
          , 'thoughts on tacos? ' + tacoThoughts
          ].join('\n');

          return 'echo "' + text + '" > test3';
        }
      }
    , test4: {
        cmd: function(){
          return 'echo "you can use callback, and error, stdout, stderr can be used as arguments"';
        }
      , callback: function(error, stdout, stderr){
          var fs = require('fs')
            , path = require('path')
            , outputPath = path.resolve(process.cwd(), 'test4');

          console.log('outputPath : ' + outputPath);
          fs.writeFileSync(outputPath, stdout, 'utf-8');
        }
      }
    , test5: {
        cmd: 'exit 8'
      , exitCodes: 8
      }
    , test6: {
        cmd: 'exit 9'
      , exitCodes: [8, 9]
      }
    , test7: 'echo "you don\'t even need an object" > test7'
    }
  });

  grunt.loadTasks('../tasks');
};
