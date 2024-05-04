#!/usr/local/bin/llrt

const { spawn } = require('child_process');

function fetchWeather() {
    const command = 'curl';
    const args = ['wttr.in'];

    const childProcess = spawn(command, args);

    childProcess.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data.toString()}`);
    });

    childProcess.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    childProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Weather fetching failed with code ${code}`);
        }
    });
}

fetchWeather();

