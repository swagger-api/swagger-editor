export default function(system) {
  return {
    rootInjects: {
      getEditorMetadata() {
        const allErrors = system.errSelectors.allErrors()
        return {
          contentString: system.specSelectors.specStr(),
          contentObject: system.specSelectors.specJson().toJS(),
          isValid: allErrors.size === 0,
          errors: allErrors.toJS()
        }
      }
    }
  }
}