const LIVE_AUTOCOMPLETE_CUTOFF = 100 // ms

export function wrapCompleters(completers) {
  let isLiveCompletionDisabled = false
  let lastSpeeds = []
  let isPerformant = () => lastSpeeds.every(speed => speed < LIVE_AUTOCOMPLETE_CUTOFF)

  return completers.map((completer, i) => {
    let ori = completer.getCompletions
    completer.getCompletions = function(editor, session, pos, prefix, callback) {
      let startTime = Date.now()
      ori(editor, session, pos, prefix, (...args) => {
        let msElapsed = Date.now() - startTime
        lastSpeeds[i] = msElapsed

        if(isLiveCompletionDisabled && isPerformant()) {
          console.warn("Manual autocomplete was performant - re-enabling live autocomplete")
          editor.setOptions({
            enableLiveAutocompletion: true
          })
          isLiveCompletionDisabled = false
        }

        if(msElapsed > LIVE_AUTOCOMPLETE_CUTOFF && editor.getOption("enableLiveAutocompletion")) {
          console.warn("Live autocomplete is slow - disabling it")
          editor.setOptions({
            enableLiveAutocompletion: false
          })
          isLiveCompletionDisabled = true
        }

        callback(...args)
      })
    }
    return completer
  })
}
