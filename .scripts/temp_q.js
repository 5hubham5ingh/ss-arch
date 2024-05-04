#!/usr/local/bin/qjs

import {exec} from "os";
import * as std from 'std';
console.log("somet",std)
const command = "curl -s wttr.in | sed -n '8,17p'";

std.node.exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing command: ${err}`);
    return;
  }
console.log(stderr);
	console.log("yup");
  console.log(stdout);
});

console.log(exec("ls"))
