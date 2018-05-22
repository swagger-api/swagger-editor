let win = {
  navigator: {
    userAgent: "fake!"
  },
  document: {
    getElementById() {},
    addEventListener() {},
    removeEventListener() {},
    documentElement: {
      setAttribute() {},
    }
  },
}

if(typeof window !== "undefined") {
  win = window
}

export default win
