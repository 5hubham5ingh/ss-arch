#!/usr/local/bin/qjs
import * as os from 'os';

const { stdout, stderr, exit_code } = os.exec(['ls', '-l']);
console.log('stdout:', stdout);
console.log('stderr', stderr);
console.log(`Exit code: ${exit_code}`);
