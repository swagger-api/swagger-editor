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
      '**/*.coffee': 'coffee'

    reporters: ['dots']
