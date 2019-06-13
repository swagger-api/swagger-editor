#!/usr/bin/env node

require("child_process").exec("npm start", {
  cwd: __dirname
}, (error, stdout, stderr) => {
  console.error(error)
  console.error(stderr)
  // eslint-disable-next-line no-console
  console.log(stdout)
})
