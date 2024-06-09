#!/usr/local/bin/llrt

import exec from "./llrtHelpers/exec.llrt.js"
import fs from "fs/promises"
import path from 'path'



// const launcher = async () => {
//   const applications = await exec('sh', ["/home/ss/.scripts/sh/getApps.sh"])
//   console.log(applications)
// }

// launcher().catch(err => console.log(err))


//kitty -1 -o allow_remote_control=yes --class=applicationMenu --title=applicationMenu sh -c "kitty @ set-font-size 20; echo If you ask them, they'll deny, but if you just listen then you'll see, they can not even lie. | lolcat -g 0286fa:02fa1f; sleep 5"

const directories = ["/usr/share/applications"]
async function getApplications() {
  const applications = [];
  for (const dir of directories) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith('.desktop')) {
          applications.push(path.join(dir, file));
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err);
    }
  }
  return applications;
}

// Function to parse .desktop files and extract names and executable commands
async function parseDesktopFiles(files) {
  const apps = {};
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const nameMatch = content.match(/^Name=(.*)$/m);
      const execMatch = content.match(/^Exec=(.*)$/m);
      if (nameMatch && execMatch) {
        const name = nameMatch[1];
        const execCommand = execMatch[1].split(' ')[0]; // Get the command, ignoring any parameters
        apps[name] = execCommand;
      }
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
    }
  }
  return apps;
}

async function getUserInput(promptText) {
  console.log('trying')
  return await exec('qjs', [`/home/ss/.scripts/js/userInput.q.js`]).catch(err => console.log(err))
}

// Main function to execute the script
(async () => {
  // Retrieve and parse applications
  const applications = await getApplications();
  const apps = await parseDesktopFiles(applications);

  console.log('got apps')
  // Prompt user to search for an application
  const query = await getUserInput('Search for an application: ');
  console.log('got query', query)
  const matchedApps = Object.keys(apps).filter(app => app.toLowerCase().includes(query.toLowerCase()));

  if (matchedApps.length > 0) {
    console.log('Select an application to launch:');
    matchedApps.forEach((app, index) => {
      console.log(`${index + 1}) ${app}`);
    });

    // Prompt user to select an application
    const choice = parseInt(await getUserInput('Enter the number of the application: '), 10) - 1;

    if (choice >= 0 && choice < matchedApps.length) {
      const selectedApp = matchedApps[choice];
      const execCommand = apps[selectedApp];
      console.log(execCommand)
      await exec('sh', [`"${execCommand}"`]);
    } else {
      console.log('Invalid selection, please try again.');
    }
  } else {
    console.log('No matching applications found.');
  }
})();

