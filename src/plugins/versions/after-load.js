const afterLoad = () => {
  // eslint-disable-next-line no-undef
  const { PACKAGE_VERSION, GIT_COMMIT, GIT_DIRTY, BUILD_TIME } = buildInfo;

  globalThis.versions = globalThis.versions || {};
  globalThis.versions.swaggerEditor = Object.create(
    {
      toString() {
        return `${this.version}/${this.gitRevision || 'unknown'}${this.gitDirty ? '-dirty' : ''}`;
      },
      valueOf() {
        return this.toString();
      },
    },
    {
      version: { value: PACKAGE_VERSION, enumerable: true },
      gitRevision: { value: GIT_COMMIT, enumerable: true },
      gitDirty: { value: GIT_DIRTY, enumerable: true },
      buildTimestamp: { value: BUILD_TIME, enumerable: true },
    }
  );
};

export default afterLoad;
