import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import get from "lodash/get"
import last from "lodash/last"
import mapValues from "lodash/mapValues"
import toArray from "lodash/toArray"
import isString from "lodash/isString"
import YAML from "js-yaml"

//eslint-disable-next-line no-unused-vars
export function getKeywordsForPath({ path, prefix, currentLine, editorValue, keywordMap }) {
  keywordMap = Object.assign({}, keywordMap)

  // is getting path was not successful stop here and return no candidates
  if (!isArray(path)) {
    return [
      {
        name: "array",
        value: " ",
        score: 300,
        meta: "Couldn't load suggestions"
      }
    ]
  }

  if(last(path) === "$ref") {
    let context = getContextType(path)
    let $refsForContext = $refablesForPath(editorValue, [context])
    return $refsForContext
  }

  if(path[path.length - 2] === "tags" && path.length > 2) {
    // 'path.length > 2' excludes top-level 'tags'
    return getGlobalCompletions(editorValue, ["tags"], "name")
  }

  let reversePath = path.slice(0).reverse()
  if(reversePath[1] === "security" && isNumeric(reversePath[0])) {
    // **.security[x]
    return getGlobalCompletions(editorValue, ["securityDefinitions"], "name")
  }

  // traverse down the keywordMap for each key in the path until there is
  // no key in the path

  var key = path.shift()

  while (key && isObject(keywordMap)) {
    keywordMap = getChild(keywordMap, key)
    key = path.shift()
  }

  // if no keywordMap was found after the traversal return no candidates
  if (!isObject(keywordMap)) {
    return []
  }

  // if keywordMap is an array of strings, return the array as list of
  // suggestions
  if (isArray(keywordMap) && keywordMap.every(isString)) {
    return keywordMap.map(constructAceCompletion.bind(null, "value"))
  }

  // If keywordMap is describing an array unwrap the inner map so we can
  // suggest for array items
  if (isArray(keywordMap)) {
    if(isArray(keywordMap[0])) {
      let indent = ""
      return keywordMap[0].map(item => {
        return {
          name: "array",
          value: indent + "- " + item,
          score: 300,
          meta: "array item"
        }
      })
    } else {
      let indent = ""
      return [{
        name: "array",
        value: indent + "- ",
        score: 300,
        meta: "array item"
      }]
    }
  }

  // if keywordMap is not an object at this point return no candidates
  if (!isObject(keywordMap)) {
    return []
  }

  // for each key in keywordMap map construct a completion candidate and
  // return the array
  return formatKeywordMap(keywordMap)
    .map(constructAceCompletion.bind(null, "keyword"))
}

function getChild(object, key) {
  var keys = Object.keys(object)
  var regex
  var isArrayAccess = /^\d+$/.test(key)

  if(isArrayAccess && isArray(object)) {
    return object[0]
  }

  for (var i = 0; i < keys.length; i++) {
    let childVal = object[keys[i]]
    regex = new RegExp(childVal.__regex || keys[i])

    if (regex.test(key) && childVal) {
      if(typeof childVal === "object" && !isArray(childVal)) {
        return Object.assign({}, childVal)
      } else {
        return childVal
      }
    }
  }
}

function formatKeywordMap(map) {
  let res = mapValues(map, (val, key) => {
    return val.__value === undefined ? key : val.__value
  })

  return toArray(res)
}

function constructAceCompletion(meta, keyword) {
  if(keyword.slice(0, 2) === "__") {
    return {}
  }

  return {
    name: keyword,
    value: keyword,
    score: 300,
    meta: meta || "keyword"
  }
}

function $refablesForPath(specStr, path) {
  let refs = Object.keys(getJSFromYaml(specStr, path) || {})

  let completions = refs.map(ref => {
    return {
      score: 0,
      meta: "local",
      value: `'#/${path.join("/")}/${ref}'`,
      caption: ref
    }
  })

  return completions || []
}

function getGlobalCompletions(specStr, path, prop) {
  let items = getJSFromYaml(specStr, path) || []
  if(isArray(items)) {
    return items
      .filter(item => !!item)
      .map(item => prop ? item[prop] : item)
      .map(name => {
        if(!name) { return {} }
        return {
          score: 0,
          meta: "local",
          value: name
        }
      })

  } else {
    return Object.keys(mapValues(items, (item) => {
      return prop ? item[prop] : item
    })).map(name => {
      if(!name) { return {} }
      return {
        score: 0,
        meta: "local",
        value: name
      }
    })
  }
}

function getJSFromYaml(yaml, path = []) {
  let obj = YAML.safeLoad(yaml)
  let sub = get(obj, path)
  return sub
}

function isNumeric(obj) {
    return !isNaN(obj)
}

export function getContextType(path) {
  let contextTypes = {
    "paths": "pathitems",
    "definitions": "definitions",
    "schema": "definitions",
    "parameters": "parameters",
    "responses": "responses"
  }

  for( var i=path.length-1; i>-1; i-- ) {
    let tag = path[i]

    if( contextTypes[tag] ) {
      return contextTypes[tag]
    }
  }
  return null
}
