#!/usr/local/bin/llrt

fetch('https://wttr.in')
    .then(response => response.text())
    .then(data => {
        // Split the response into lines
        const lines = data.split('\n');
        // Extract lines 8 to 17
        const relevantLines = lines.slice(7, 17);
        // Join the relevant lines into a single string
        const output = relevantLines.join('\n');
        console.log(data);
    })
    .catch(error => console.error('Error fetching weather:', error));

