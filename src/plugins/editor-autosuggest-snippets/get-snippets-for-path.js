import isArray from "lodash/isArray"

export default function getSnippetsForPath({ path, snippets }) {
  // find all possible snippets, modify them to be compatible with Ace and
  // sort them based on their position. Sorting is done by assigning a score
  // to each snippet, not by sorting the array
  if (!isArray(path)) {
    return []
  }

  return snippets
    .filter(snippet => {
      return snippet.path.length === path.length
    })
    .filter(snippet => {
      return snippet.path.every((k, i) => {
        return !!(new RegExp(k)).test(path[i])
      })
    })
    .map(snippet => {
      // change shape of snippets for ACE
      return {
        caption: snippet.name,
        snippet: snippet.content,
        meta: "snippet"
      }
    })
    .map(snippetSorterForPos(path))
}

export function snippetSorterForPos(path) {
  return function(snippet) {
    // by default score is high
    let score = 1000

    // if snippets content has the keyword it will get a lower score because
    // it's more likely less relevant
    // (FIX) is this logic work for all cases?
    path.forEach(function(keyword) {
      if (snippet.snippet.indexOf(keyword)) {
        score = 500
      }
    })

    snippet.score = score

    return snippet
  }
}
