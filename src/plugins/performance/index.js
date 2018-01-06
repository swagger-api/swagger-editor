const getTimestamp = ((that) => {
  if(that.performance && that.performance.now) {
    return that.performance.now.bind(that.performance)
  }
  return Date.now.bind(Date)
})(self || window)

export default function PerformancePlugin() {
  if(!(window || {}).LOG_PERF) {
    return {
      fn: {
        getTimestamp,
        Timer: TimerStub,
        timeCall: (name,fn) => fn(),
      }
    }
  }

  return {
    fn: {
      getTimestamp,
      Timer,
      timeCall,
    }
  }
}

function timeCall(name,fn) {
  fn = fn || name
  name = typeof name === "function" ? "that" : name
  const a = getTimestamp()
  const r = fn()
  const b = getTimestamp()
  console.log(name,"took", b - a, "ms") // eslint-disable-line no-console
  return r
}

function TimerStub() {
  this.start = this.mark = this.print = Function.prototype
}

function Timer(name, _getTimestamp=getTimestamp) {
  this._name = name
  this.getTimestamp = _getTimestamp
  this._markers = []
  this.start()
}

Timer.prototype.start = function() {
  this._start = this.getTimestamp()
}

Timer.prototype.mark = function(name) {
  this._markers = this._markers || []
  this._markers.push({
    time: this.getTimestamp(),
    name
  })
}

Timer.prototype.print = function(name) {
  this.mark(name)
  this._markers.forEach(m => {
    // eslint-disable-next-line no-console
    console.log(this._name, m.name, m.time - this._start, "ms")
  })
  this._markers = []
  this.start()
}
