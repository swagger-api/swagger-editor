export function fromPosition(position) {
  if (!position) {
    return null;
  }
  return { character: position.character - 1, line: position.line - 1 };
}

export function toRange(range) {
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

export function fromRange(range) {
  if (!range) {
    return null;
  }
  return {
    start: {
      line: range.startLineNumber - 1,
      character: range.startColumn - 1,
    },
    end: { line: range.endLineNumber - 1, character: range.endColumn - 1 },
  };
}
