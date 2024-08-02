import { exec, readdir, ttySetRaw, ttyGetWinSize } from 'os';
import { in as stdin, exit } from 'std'

const wallpapersDir = "/home/ss/Downloads/wallpaper";
const wallpapers = readdir(wallpapersDir)[0].filter(name => name !== '.' && name !== '..');

exec(['clear'])


const ESC = '\u001B[';
const SEP = ';';
const cursorHide = ESC + '?25l'
print(cursorHide)

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

const imageWidth = 42; // arg
const imageHeight = 10;// arg
const containerWidth = imageWidth + 2;
const containerHeight = imageHeight + 1;
let [width, height] = ttyGetWinSize(2);
const xy = [];

const calculateCoordinates = () => {
  let generatedCount = 0;
  xy.length = 0;
  for (let y = 2; ; y += containerHeight) {
    for (let x = 2; x + containerWidth < width; x += containerWidth) {
      if (generatedCount < wallpapers.length) {
        xy.push([x, y]);
        generatedCount++;
      }
      else return;
    }
  }
}

calculateCoordinates();
const isScreenInsefficient = () => xy.some(([x, y]) => y + containerHeight > height);


while (isScreenInsefficient()) {
  exec(['kitty', '@', 'set-font-size', '--', '-1']); // this won't work when kitty remote controll is disabled
  const [w, h] = ttyGetWinSize(2);
  width = w;
  height = h;
  calculateCoordinates();
}


wallpapers.forEach((wallpaper, i) => {
  const wallpaperDir = `${wallpapersDir}/${wallpaper}`;
  const [x, y] = i < xy.length ? xy[i] : xy[i % xy.length];
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
  const border = `${OO}${xBorderUp}${newLine}${yBorder.repeat(containerHeight - 1)}${xBorderDown}${OO}`
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
  if (selection + 1 === xy.length) return;
  const clearScreen = '\x1b[0J';
  print(cursorTo(0, 0), clearScreen)
  selection++;
  drawContainerBorder(xy[selection])
}

const handleSelection = () => {
  const wallpaper = wallpapers[selection];
  const wallpaperDir = `${wallpapersDir}/${wallpaper}`;
  exec(['hyprctl', '-q', 'hyprpaper unload all']);
  exec(['hyprctl', '-q', `hyprpaper preload ${wallpaperDir}`]);
  exec(['hyprctl', '-q', `hyprpaper wallpaper eDP-1,${wallpaperDir}`]);
}

const moveUp = () => {

}

ttySetRaw();
while (1) {
  const input = stdin.readAsString(1)
  switch (input) {
    case 'h': moveLeft(); break;
    case 'l': moveRight(); break;
    case ' ': handleSelection(); break;
    case 'q': exec(['clear']); exit(1);
  }
}
