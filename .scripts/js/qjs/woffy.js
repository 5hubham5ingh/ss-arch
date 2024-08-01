import { exec, readdir, ttySetRaw, ttyGetWinSize } from 'os';
import { in as stdin, exit } from 'std'

const wallpapersDir = "/home/ss/Downloads/wallpaper";
const wallpapers = readdir(wallpapersDir)[0].filter(name => name !== '.' && name !== '..');

exec(['clear'])
ttySetRaw();

const ESC = '\u001B[';
const SEP = ';';
const cursorTo = (x, y) => {
  if (typeof x !== 'number') {
    throw new TypeError('The `x` argument is required');
  }

  if (typeof y !== 'number') {
    return ESC + x + 'G';
  }

  return ESC + y + SEP + (x + 1) + 'H';
};


const cursorMove = (x, y) => {
  if (typeof x !== 'number') {
    throw new TypeError('The `x` argument is required');
  }

  let returnValue = '';

  if (x < 0) {
    returnValue += ESC + (-x) + 'D';
  } else if (x > 0) {
    returnValue += ESC + x + 'C';
  }

  if (y < 0) {
    returnValue += ESC + (-y) + 'A';
  } else if (y > 0) {
    returnValue += ESC + y + 'B';
  }

  return returnValue;
};

const imageWidth = 42;
const imageHeight = 10;
const containerWidth = imageWidth + 2;
const containerHeight = imageHeight + 1;
let [width, height] = ttyGetWinSize(2);

const calculateCoordinates = () => {
  const coordinates = [];
  let generatedCount = 0;

  for (let y = 2; y < height; y += containerHeight) {
    for (let x = 2; x + containerWidth < width; x += containerWidth) {
      if (generatedCount < wallpapers.length) {
        coordinates.push([x, y]);
        generatedCount++;
      } else {
        return coordinates;
      }
    }
  }
  return coordinates;
}

let xy = calculateCoordinates();

//print(JSON.stringify(xy))


let isScreenInsefficient = () => xy.some(([x, y], i) => {
  if (y + containerHeight > height) return true;
  return false;
});


while (isScreenInsefficient()) {
  exec(['kitty', '@', 'set-font-size', '--', '-1']);
  const [w, h] = ttyGetWinSize(2);
  width = w;
  height = h;
}
xy = calculateCoordinates();
wallpapers.forEach((wallpaper, i) => {
  const wallpaperDir = `${wallpapersDir}/${wallpaper}`;
  const [x, y] = xy[i];
  const cordinates = `${imageWidth}x${imageHeight}@${x}x${y}`;
  exec(['kitten', 'icat', '--scale-up', '--place', cordinates, wallpaperDir])
})

let selection = 0;
const drawContainerBorder = ([x, y]) => {
  const OO = cursorTo(x, y);
  const xBorderUp = '─' + '─'.repeat(containerWidth - 2) + '╮';
  const xBorderDown = '╰' + '─'.repeat(containerWidth - 2) + '─';
  const newLine = cursorMove(-1 * (containerWidth + 2), 1);
  const yBorder = `│${' '.repeat(containerWidth)}│${newLine}`;
  const border = `${OO}${xBorderUp}${newLine}${yBorder.repeat(containerHeight - 1)}${xBorderDown}`
  print(border)
}

drawContainerBorder(xy[selection])

const moveLeft = () => {
  if (selection < 1) return;
  const clearScreen = '\x1b[0J';
  print(cursorTo(0, 0), clearScreen)
  selection--;
  drawContainerBorder(xy[selection])
}

const moveRight = () => {
  if (selection === wallpapers.length - 1) return;
  const clearScreen = '\x1b[0J';
  print(cursorTo(0, 0), clearScreen)
  selection++;
  drawContainerBorder(xy[selection])
}

const handleSelection = () => {
  const wallpaper = wallpapers[selection];
  const wallpaperDir = `${wallpapersDir}/${wallpaper}`;
  exec(['hyprctl', 'hyprpaper unload all']);
  exec(['hyprctl', `hyprpaper preload ${wallpaperDir}`]);
  exec(['hyprctl', `hyprpaper wallpaper eDP-1,${wallpaperDir}`]);
}

const moveUp = () => {

}

while (1) {
  const input = stdin.readAsString(1)
  switch (input) {
    case 'h': moveLeft(); break;
    case 'l': moveRight(); break;
    case ' ': handleSelection(); break;
    case 'q': exec(['clear']); exit(1);
  }
}
