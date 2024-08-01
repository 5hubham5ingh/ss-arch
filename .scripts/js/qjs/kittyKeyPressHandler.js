import * as std from 'std';
import * as os from 'os';

// print('\x1b[>1u')
let input;
os.ttySetRaw();
while (input !== 'q') {

  input = std.in.readAsString(1);
  print(input.split('').reverse().join())
}

// print('\x1b[<1u')


