#!/usr/local/bin/llrt

import exec from "./llrtHelpers/exec.llrt.js";

function fetchWeather() {
  const command = 'hyprctl';
  const args = ['-j','monitors'];
	const handler = (data) => {
		console.log(data)
	}
  exec(command,args,handler)
}

fetchWeather();
