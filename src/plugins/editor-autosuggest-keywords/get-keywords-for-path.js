import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import mapValues from "lodash/mapValues"
import isPlainObject from "lodash/isPlainObject"
import toArray from "lodash/toArray"
import isString from "lodash/isString"
import get from "lodash/get"

export default function getKeywordsForPath({ system, path, keywordMap }) {
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

  if(path[path.length - 2] === "tags" && path.length > 2) {
    // 'path.length > 2' excludes top-level 'tags'
    return system.specSelectors.tags().map(tag => ({
      score: 0,
      meta: "local",
      value: tag.get("name"),
    })).toJS()
  }

  let reversePath = path.slice(0).reverse()
  if(reversePath[1] === "security" && isNumeric(reversePath[0])) {
    // **.security[x]
    return system.specSelectors.securityDefinitions().keySeq().map(sec => ({
      score: 0,
      meta: "local",
      caption: sec,
      snippet: `${sec}: []`
    })).toJS()
  }

  if(reversePath[0] === "security") {
    // **.security:
    return system.specSelectors.securityDefinitions().keySeq().map(sec => ({
      score: 0,
      meta: "local",
      caption: sec,
      snippet: `\n- ${sec}: []`
    })).toJS()
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
      return keywordMap[0].map(item => {
        return {
          name: "array",
          value: "- " + item,
          score: 300,
          meta: "array item"
        }
      })
    } else {
      return [{
        name: "array",
        value: "- ",
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
  return suggestionFromSchema(keywordMap)
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

    if(!childVal) {
      return null
    }
    
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

function suggestionFromSchema(map) {
  const res = toArray(mapValues(map, (val, key) => {
    const keyword = get(val, "__value", key)
    const meta = isPlainObject(val) ? "object" : "keyword"

    return constructAceCompletion(meta, keyword)
  }))
  return res
}

function constructAceCompletion(meta, keyword) {
  if(keyword.slice(0, 2) === "__") {
    return {}
  }

  // Give keywords, that extra colon
  let snippet
  switch(meta) {
  case "keyword":
    snippet = `${keyword}: `
    break
  case "object":
    snippet = `${keyword}:\n  `
    break
  default:
    snippet = keyword
  }

  // snippet's treat `$` as special characters
  snippet = snippet.replace("$", "\\$")

  return {
    snippet,
    caption: keyword,
    score: 300,
    meta,
  }
}

function isNumeric(obj) {
    return !isNaN(obj)
}
