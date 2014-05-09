module.exports = (config) ->
  config.set
    frameworks: ['jasmine']

    files: [
      '*.coffee'
    ]

    browsers: ['Firefox']

    coffeePreprocessor:
      options:
        sourceMap: true

    preprocessors:
      'plus.coffee': 'coverage'
      'test.coffee': 'coffee'

    reporters: ['dots', 'coverage']
