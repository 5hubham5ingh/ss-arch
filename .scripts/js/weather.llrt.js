#!/usr/local/bin/llrt

import exec from "./llrtHelpers/exec.llrt.js"
export default async () => {
  const command = 'sh';
  const args = ['-c', 'curl -s wttr.in | sed -n "8,17p"'];
  const weather = await exec(command, args);
  console.log(weather);
}


// process.stdin.setEncoding('utf-8');
//
// console.log('Please enter some text:');
//
// process.stdin.on('data', (data) => {
//   console.log(`You entered: ${data}`);
//   process.exit(); // Exit after reading input
// });
//
