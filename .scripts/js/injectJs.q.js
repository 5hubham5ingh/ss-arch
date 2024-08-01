#!/usr/local/bin/qjs
import { evalScript } from "std";

const result = evalScript('2 + 3');
console.log(result);


const message = evalScript('const name = "Bob"; `Hello, ${name}!`', { args: ['name'] });
console.log(message); 
