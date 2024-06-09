#!/usr/local/bin/qjs

import * as std from "std";

let name = 'world';
if (undefined !== scriptArgs[1]) {
  name = scriptArgs[1];
}
//console.log(`Hello ${name} !`);

while (true) {
  console.log(`Type 'exit' to exit script`);
  const str = std.in.getline();
  if ('exit' == str) {
    break;
  }
}
//console.log(`Goodbye ${name}!`);
console.log(name)
