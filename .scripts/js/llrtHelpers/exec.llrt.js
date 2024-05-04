#!/usr/local/bin/llrt

import { spawn } from 'child_process';

export default function exec(command, args) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args);
    let output = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    childProcess.on('error', (error) => {
      reject(`Error: ${error.message}`);
    });

    childProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Command execution failed with code ${code}`);
      } else {
        resolve(output);
      }
    });
  });
}

