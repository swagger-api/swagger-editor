export function wrapCompleters(completers, cutoff = 100) {
  let isLiveCompletionDisabled = false
  let lastSpeeds = []
  let isPerformant = () => lastSpeeds.every(speed => speed < cutoff)

  if(cutoff === 0 || cutoff === "0") {
    // never disable live autocomplete
    return completers
  }

  return completers.map((completer, i) => {
    let ori = completer.getCompletions
    completer.getCompletions = function(editor, session, pos, prefix, callback) {
      let startTime = Date.now()
      try {
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

          if(msElapsed > cutoff && editor.getOption("enableLiveAutocompletion")) {
            console.warn("Live autocomplete is slow - disabling it")
            editor.setOptions({
              enableLiveAutocompletion: false
            })
            isLiveCompletionDisabled = true
          }

          callback(...args)
        })
      } catch(e) {
        console.error("Autocompleter encountered an error")
        console.error(e)
        callback(null, [])
      }
    }
    return completer
  })
}
