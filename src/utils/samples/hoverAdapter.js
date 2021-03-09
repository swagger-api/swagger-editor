/* eslint-disable no-void */
// likely want this as a utils import
// e.g. css: CompletionAdapter, HoverAdapter, DefinitionAdapter, ReferenceAdapter, RenameAdapter
function fromPosition(position) {
  if (!position) {
    return null;
  }
  return { character: position.column - 1, line: position.lineNumber - 1 };
}

// likely want this as a utils import
function toRange(range) {
  if (!range) {
    return null;
  }
  return new Range(
    range.start.line + 1,
    range.start.character + 1,
    range.end.line + 1,
    range.end.character + 1
  );
}

export default class HoverAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  async provideHover(model, position) {
    const resource = model.uri;
    // console.log('hoverAdapter. resource:', resource);
    // console.log('hoverAdapter. position:', position);
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    // console.log('hoverAdapter. worker:', worker);
    const uri = resource.toString();
    // console.log('hoverAdapter. uri:', uri);
    const computedPosition = fromPosition(position);
    // console.log('hoverAdapter. computedPosition:', computedPosition);
    // call the validate method proxy from the language service and get hover info
    // const info = await worker.doHover(resource.toString(), fromPosition(position));
    const info = await worker.doHover(uri, computedPosition);
    // console.log('hoverAdapter. info:', info);
    if (!info) {
      // console.log('hoverAdapter, !info case');
      return Promise.resolve(null);
    }
    // return p2m.asHover(hover);
    return Promise.resolve({
      range: toRange(info.range),
      contents: info.contents, // do we need to support markdown, via utils func?
    });
  }
}
