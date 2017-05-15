// (ctx, editor, session, pos, prefix, cb)
export default (ori) => (...args) => {
  ori(...args)

  const [,,,,,cb] = args
  return cb(null, [
    {
      caption: "Does this work?",
      snippet: "one:\n  two: three!",
      meta: "snippet"
    }
  ])
}
