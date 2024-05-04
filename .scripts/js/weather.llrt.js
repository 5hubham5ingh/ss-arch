#!/usr/local/bin/llrt

import exec from "./llrtHelpers/exec.llrt.js"
import args from "./llrtHelpers/scriptArgs.llrt.js"

console.log(args())
const fetchWeather = () => {
  const command = 'sh';
  const args = ['-c', 'curl -s wttr.in | sed -n "8,17p"'];
  exec(command,args,console.log, fetchWeather )
}
