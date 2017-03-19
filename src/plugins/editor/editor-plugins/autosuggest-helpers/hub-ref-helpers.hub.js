export function parseDomain( rawDomain ){
  return rawDomain.properties.reduce( function( prev, curr ){
    prev[ curr.type.toLowerCase() ] = curr.value || curr.url
    return prev
  }, { name: rawDomain.name } )
}

export function buildSuggestions(domain, index, type) {
  var components = domain["x-suggestions"].split( "," )

  return components.map(component => {
    var componentPath = domain["x-domain"] + `#/${type}/${component}`
    var componentMeta = domain["x-domain"]
      .split("/")
      .reverse()
      .slice(0,3)
      .reverse()
      .join("/")

    return {
      caption: component,
      score: -1000,
      meta: componentMeta,
      value: `'${componentPath}'`
    }
  })
}

export function stripVersion(str) {
  let versionPosition = str.lastIndexOf("/")
  return str.slice(0, versionPosition)
}
