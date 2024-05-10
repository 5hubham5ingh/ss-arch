#!/usr/local/bin/llrt

import exec from "./llrtHelpers/exec.llrt.js"
export default async () => {
  	const command = 'sh';
  	const args = ['-c', 'curl -s wttr.in | sed -n "8,17p"'];
	const weather  = await exec(command, args);
	console.log(weather);
}
