/*
 For:            Firefox browser
 Author:         https://github.com/5hubham5ingh
 Version:        0.0.1
 Prerequisite:   Firefox addon Foxpanel https://github.com/5hubham5ingh/foxpanel
*/

export function getDarkThemeConf(colors) {
  const theme = generateTheme(colors, false);
  return generateThemeConfig(theme);
}

export function getLightThemeConf(colors) {
  const theme = generateTheme(colors);
  return generateThemeConfig(theme);
}

export function setTheme(themeConfigPath) {
  const themeConfigPathCacheFile = STD.open(
    HOME_DIR.concat("/.cache/baremetal/themeFilePath.txt"),
    "w+",
  );

  themeConfigPathCacheFile.puts(themeConfigPath);
  themeConfigPathCacheFile.flush();
  themeConfigPathCacheFile.close();
}

function generateTheme(colorCodes, isDark = true) {
  const colors = colorCodes.map((c) => Color(c));

  // Select distinct colors for various UI elements
  const foreground = isDark ? Color("white") : Color("#666666");
  const [
    popup,
    background,
    backgroundExtra,
    backgroundLight,
    accentPrimary,
    accentSecondary,
    complimentry1,
    complimentry2,
  ] = selectDistinctColors(colors, 8).map((color) => {
    while (Color.isReadable(color, foreground)) {
      isDark ? color.saturate(1).brighten(1) : color.desaturate(1).darken(1);
    }
    return color;
  });

  return {
    popup,
    foreground,
    background,
    backgroundExtra,
    backgroundLight,
    accentPrimary,
    accentSecondary,
    complimentry1,
    complimentry2,
    variant: !isDark ? "dark" : "light",
  };
}

function generateThemeConfig(theme) {
  return JSON.stringify({
    colors: {
      accentcolor: theme.accentPrimary.toHexString(),
      textcolor: theme.foreground.toHexString(),

      icons: theme.foreground.toHexString(),
      icons_attention: theme.accentPrimary.toHexString(),
      frame: theme.backgroundExtra.toHexString(),
      frame_inactive: theme.background.toHexString(),
      tab_text: theme.foreground.toHexString(),
      tab_loading: theme.accentSecondary.toHexString(),
      tab_background_text: theme.foreground.clone().lighten().toHexString(),
      tab_selected: theme.accentPrimary.toHexString(),
      tab_line: theme.accentPrimary.toHexString(),
      toolbar: theme.accentPrimary.toHexString(),
      toolbar_text: theme.foreground.toHexString(),
      toolbar_field: theme.backgroundExtra.toHexString(),
      toolbar_field_focus: theme.backgroundLight.toHexString(),
      toolbar_field_separator: theme.background.toHexString(),
      toolbar_field_text: theme.foreground.toHexString(),
      toolbar_field_text_focus: theme.foreground.clone().darken().toHexString(),
      toolbar_field_border: theme.backgroundLight.toHexString(),
      toolbar_field_border_focus: theme.backgroundLight.toHexString(),
      toolbar_field_highlight: theme.accentPrimary.toHexString(),
      toolbar_field_highlight_text: theme.background.toHexString(),
      toolbar_top_separator: theme.accentPrimary.toHexString(),
      toolbar_vertical_separator: theme.backgroundLight.toHexString(),
      toolbar_bottom_separator: theme.background.toHexString(),
      ntp_card_background: theme.backgroundExtra
        .toHexString(),
      ntp_background: theme.background.toHexString(),
      ntp_text: theme.foreground.clone().lighten(100).toHexString(),
      popup: theme.popup.toHexString(),
      popup_border: theme.popup.toHexString(),
      popup_text: theme.foreground.toHexString(),
      popup_highlight: theme.accentPrimary.toHexString(),
      popup_highlight_text: theme.background.toHexString(),
      sidebar: theme.complimentry1.toHexString(),
      sidebar_text: theme.foreground.toHexString(),
      sidebar_highlight: theme.accentPrimary.toHexString(),
      sidebar_highlight_text: theme.background.toHexString(),
      bookmark_text: theme.foreground.toHexString(),
      button_background_hover: theme.backgroundExtra.toHexString(),
      button_background_active: theme.backgroundLight.toHexString(),
      tab_background_separator: theme.accentPrimary.toHexString(),
      sidebar_border: theme.complimentry1.toHexString(),
    },
    images: null,
    properties: {
      color_scheme: theme.variant,
      content_color_scheme: theme.variant,
    },
  });
}

function selectDistinctColors(colors, count) {
  // Sort colors in ascending order
  const sortedcolors = colors.sort((a, b) =>
    a.getBrightness() - b.getBrightness()
  );

  if (count === 1) {
    return [sortedcolors[0]];
  }

  if (count === 2) {
    return [sortedcolors[0], sortedcolors[sortedcolors.length - 1]];
  }

  // Initialize result with min and max values
  const result = [];

  result[0] = sortedcolors[0];
  result[sortedcolors.length - 1] = sortedcolors[sortedcolors.length - 1];

  // For remaining count-2 colors, alternate between taking values
  // from middle progressing outwards
  let left = 1; // Next position from left
  let right = colors.length - 2; // Next position from right
  let remainingCount = count - 2;
  let addFromLeft = false; // Flag to alternate between left and right

  while (remainingCount > 0) {
    if (addFromLeft) {
      result[left] = sortedcolors[left];
      left++;
    } else {
      result[right] = sortedcolors[right];
      result.push(sortedcolors[right]);
      right--;
    }
    addFromLeft = !addFromLeft; // Toggle for next iteration
    remainingCount--;
  }

  return result.filter(Boolean);
}
