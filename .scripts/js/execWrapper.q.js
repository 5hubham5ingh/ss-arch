#!/usr/local/bin/qjs
import * as os from 'os';

export const exec = (command, args = []) => {
  return new Promise((resolve, reject) => {
    const childProcess = os.exec([command, ...args]);

    if (childProcess === undefined) {
      reject(new Error(`Failed to execute command: ${command}`));
      return;
    }

    const exitCode = childProcess;
    if (exitCode !== 0) {
      reject(new Error(`Command execution failed with code ${exitCode}`));
    } else {
      resolve();
    }
  });
}

exec('ls')