#!/usr/local/bin/llrt

import createTable from "./llrtHelpers/createTable.llrt.js";
import exec from "./llrtHelpers/exec.llrt.js";

const sysInfo = async () => {
  const brightness = await exec('cat', ['/sys/class/backlight/intel_backlight/brightness']);
  const maxBrightness = await exec('cat', ['/sys/class/backlight/intel_backlight/max_brightness']);
  const brightnessInPercent = Math.round(parseInt(brightness) / parseInt(maxBrightness) * 100);

  const soundInfo = (await exec('pactl', ['list', 'sinks'])).split('\n');
  const currentVolume = soundInfo[9].match(/\d+%/)[0];
  const activeDevice = soundInfo[85].match(/speaker/)[0] ? 'speaker' : 'headphones';

  const batteryInfo = (await exec('upower', ['-i', '/org/freedesktop/UPower/devices/battery_BAT1'])).split('\n');
  const state = batteryInfo[10].split(/\s+/)[2]
  const powerInPercentage = batteryInfo[19].split(/\s+/)[2];

  const wifiNetwork = (await exec('iwconfig', ['wlan0'])).split('\n')[0].match(/ESSID:"(\w+)"/)[1];
  const wifiState = wifiNetwork ? 'connected' : 'disconnected';

  const headers = ["Battery", "Wifi", "Sound", "Screen"];
  const dataRows = [
    [`Level: ${powerInPercentage}`, `State: ${wifiState}`, `Volume: ${currentVolume}`, `Brightness: ${brightnessInPercent}`],
    [`State: ${state}`, `Network: ${wifiNetwork}`, `Device: ${activeDevice}`, 'Resolution: 1020x1080']
  ]
  const dataTable = createTable(4,headers,dataRows)
  console.log(dataTable);
}

sysInfo();

