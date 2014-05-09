module.exports = (config) ->
  config.set do
    frameworks: ['jasmine']

    files: [
      '*.ls'
    ]

    browsers: ['Firefox']

    preprocessors:
      '**/*.ls': 'live'

    reporters: ['dots']
