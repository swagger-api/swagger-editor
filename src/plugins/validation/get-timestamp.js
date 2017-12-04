export default function getTimestamp() {
  if(typeof performance !== "undefined" && performance.now) {
    return performance.now()
  } else if(typeof self !== "undefined" && typeof self.performance !== "undefined" && self.performance.now) {
    return self.performance.now()
  } else {
    return Date.now()
  }
}
