function getMenu() {
  return {
    "Hypr Windows": focusWindows(),
    "Hypr keybinds": hyprKeyBinds(),
  };
}

const hyprState = JSON.parse(await execAsync("hyprctl -j clients"));

function focusWindows() {
  return hyprState.map((window) => ({
    name: window.class,
    description: window.title.replace("#", "_"), // replacing # as it is the internal delimeter for fzf
    exec: `hyprctl dispatch focuswindow address:${window.address}`,
  }));
}

const hyprBinds = JSON.parse(await execAsync("hyprctl -j binds"));

function hyprKeyBinds() {
  const mods = generateModMaskMap();
  return hyprBinds.map((keyBind) => ({
    name: `${
      (mods[keyBind.modmask] ?? [])?.join(" + ").concat(" ")
    }${keyBind.key}`,
    description: `${keyBind.description}`,
    exec: `${keyBind.dispatcher} ${keyBind.arg}`,
  }));

  function generateModMaskMap() {
    const modMaskMap = {};

    function parseModMask(modmask) {
      const modifiers = [];
      if (modmask & 1) modifiers.push("SHIFT");
      if (modmask & 4) modifiers.push("CTRL");
      if (modmask & 8) modifiers.push("ALT");
      if (modmask & 64) modifiers.push("SUPER");
      return modifiers;
    }

    const validModifiers = [1, 4, 8, 64]; // Individual modifiers

    let validMasks = [0];

    for (const mod of validModifiers) {
      const newMasks = [];
      for (const mask of validMasks) {
        newMasks.push(mask | mod); // Combine with existing masks
      }
      validMasks = [...validMasks, ...newMasks];
    }

    validMasks = validMasks.filter((mask) => mask !== 0);

    for (const mask of validMasks) {
      modMaskMap[mask] = parseModMask(mask).reverse();
    }

    return modMaskMap;
  }
}

export default getMenu();
