// Enable Ace editor autocompletions
export const enableAutocompletions = ({editor}) => () => {
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  })
}

// Add completers. Just override this method. And concat on your completer(s)
// see: https://github.com/ajaxorg/ace/blob/master/lib/ace/autocomplete.js
// eg: return ori(...args).concat({ getCompletions() {...}})
export const addAutosuggestionCompleters = () => () => {
  return []
}
