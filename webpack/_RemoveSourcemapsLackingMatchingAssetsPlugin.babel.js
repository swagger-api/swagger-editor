/**
 * @prettier
 */
export default class RemoveSourcemapsLackingMatchingAssetsPlugin {
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tap(
      "RemoveSourcemapsLackingMatchingAssetsPlugin",
      compilation => {
        const assetNames = Object.keys(compilation.assets)

        const sourcemapAssetNames = assetNames.filter(str =>
          str.endsWith(".map")
        )

        const sourcemapAssetsWithoutMatchingSourceAsset = sourcemapAssetNames.filter(
          name => {
            return assetNames.indexOf(name.slice(0, -4)) === -1
          }
        )

        sourcemapAssetsWithoutMatchingSourceAsset.forEach(name => {
          console.warn(
            `RemoveSourcemapsLackingMatchingAssetsPlugin: blocking emission of "${name}"`
          )
          delete compilation.assets[name]
        })
      }
    )
  }
}
