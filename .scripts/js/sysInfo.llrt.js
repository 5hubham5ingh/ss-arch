#!/usr/local/bin/llrt

import createTable from "./llrtHelpers/createTable.llrt.js";
import exec from "./llrtHelpers/exec.llrt.js";
import delLine from "./llrtHelpers/delLine.llrt.js";
import weather from "./weather.llrt.js"
const sysInfo = async () => {

  const brightness = await exec('cat', ['/sys/class/backlight/intel_backlight/brightness']);
  const maxBrightness = await exec('cat', ['/sys/class/backlight/intel_backlight/max_brightness']);
  const brightnessInPercent = Math.round(parseInt(brightness) / parseInt(maxBrightness) * 100);

  const soundInfo = (await exec('pactl', ['list', 'sinks'])).split('\n');
  const currentVolume = soundInfo[9].match(/\d+%/)[0];
  const activeDeviceInfo = soundInfo[89] || soundInfo[85];
  const activeDevice = activeDeviceInfo.match(/speaker/) ? 'speaker' : 'headphones';

  const batteryInfo = (await exec('upower', ['-i', '/org/freedesktop/UPower/devices/battery_BAT1'])).split('\n');
  const state = batteryInfo[10].split(/\s+/)[2] === 'charging' ? `- ${batteryInfo[19].split(':')[1].trim()}` : `+ ${batteryInfo[19].split(':')[1].trim()}`
  const powerInPercentage = state !== 'full' ? batteryInfo[20].split(/\s+/)[2] : batteryInfo[19].split(/\s+/)[2];

  const wifiNetwork = (await exec('iwconfig', ['wlan0'])).split('\n')[0].match(/ESSID:"(\w+)"/)[1];
  const wifiState = wifiNetwork ? 'connected' : 'disconnected';

  const headers = ["Battery", "Wifi", "Sound", "Screen"];
  const spaceBetween = " ".repeat(4);
  const dataRows = [
    [` Level:${spaceBetween}${powerInPercentage} `, ` State:${spaceBetween}${wifiState} `, ` Volume:${spaceBetween}${currentVolume} `, ` Brightness:${spaceBetween}${brightnessInPercent} `],
    [` State:${spaceBetween}${state} `, ` Network:${spaceBetween}${wifiNetwork} `, ` Device:${spaceBetween}${activeDevice} `, ` Resolution:${spaceBetween}1020x1080 `]
  ]
  const dataTable = createTable(4, headers, dataRows, 8)

  console.log(dataTable);
}


const updateSysInfo = async () => {
  delLine(8);
  await sysInfo().catch(err => 0)
}

//    stand alone
//   weather().then(() => {
//  sysInfo()
//    setInterval(updateSysInfo,  1000);
//   })

// with bash
sysInfo().catch(err => 0)
setInterval(updateSysInfo, 60 * 1000);
