/*
 For:            Visual studio code
 Author:         https://github.com/5hubham5ingh
 Prerequisite:   Installed and enabled WallWiz-theme in vscode from vscode marketplace.
 Version:        0.0.1
 */

function generateTheme(colors, isDark) {
  const sortedColors = colors.sort((a, b) => {
    const la = Color(a).getLuminance();
    const lb = Color(b).getLuminance();
    return isDark ? la - lb : lb - la;
  });

  const background = sortedColors[0];
  const foreground = sortedColors[colors.length - 1];

  const midIndex = Math.floor(sortedColors.length / 2);
  const selection = sortedColors[midIndex];
  const cursor = isDark
    ? sortedColors[Math.floor(midIndex / 2)]
    : sortedColors[Math.floor(midIndex * 1.5)];

  const black = isDark
    ? sortedColors[1]
    : sortedColors[sortedColors.length - 2];
  const white = isDark
    ? sortedColors[sortedColors.length - 2]
    : sortedColors[1];

  return Object.assign(
    {
      background,
      foreground,
      selection,
      cursor,
      black,
      white,
    },
    ...sortedColors.filter(
      (color) =>
        color !== selection ||
        color !== cursor,
    )
      .map((color, i) => ({
        [`color${i + 1}`]: adjustColorForReadability(background, color),
      })),
  );
}

function adjustColorForReadability(background, foreground) {
  const fg = Color(foreground);
  while (!Color.isReadable(background, foreground)) {
    fg.brighten(1).saturate(1);
    const hex = fg.toHex();
    if (hex === "000000" || hex === "ffffff") {
      return Color(foreground).brighten().saturate().toHexString();
    }
  }

  return fg.toHexString();
}

function generateThemeConfig(theme, isDark) {
  const vscodeTheme = {
    "name": "WallWiz Theme",
    "semanticHighlighting": true,
    "colors": {
      // General
      "editor.background": isDark
        ? Color(theme.background).darken().toHexString()
        : Color(theme.background).lighten().toHexString(),
      "editor.foreground": theme.foreground,
      "textLink.foreground": "#569cd6",
      "textLink.activeForeground": "#569cd6",
      "editor.selectionForeground": theme.foreground,
      "editorCursor.foreground": theme.cursor,

      // Title Bar
      "titleBar.activeBackground": theme.background,
      "titleBar.activeForeground": theme.foreground,
      "titleBar.inactiveBackground": Color(theme.background).lighten()
        .toHexString(),
      "titleBar.inactiveForeground": Color(theme.foreground).lighten()
        .toHexString(),

      // Side Bar
      "sideBar.background": theme.black,
      "sideBar.foreground": theme.foreground,

      // Status bar
      "statusBar.background": theme.background,
      "statusBar.foreground": theme.foreground,
      "statusBar.debuggingBackground": Color(theme.background).brighten()
        .saturate()
        .toHexString(),
      "statusBar.debuggingForeground": Color(theme.foreground).brighten()
        .saturate()
        .toHexString(),
      "statusBar.border": "#000",

      // Activity bar
      "activityBar.background": theme.background,
      "activityBar.foreground": theme.foreground,
      "activityBar.activeBorder": Color(theme.background).brighten()
        .toHexString(),
      "activityBar.inactiveForeground": Color(theme.foreground).lighten()
        .toHexString(),
      "activityBar.activeFocusBorder": theme.white,
      "activityBar.border": theme.black,

      // Remove borders
      "tab.border": "#00000000",
      "sideBar.border": "#00000000",
      "panel.border": "#00000000",
      "titleBar.border": "#00000000",
      "focusBorder": "#00000000",
      "window.activeBorder": "#00000000",
      "contrastBorder": "#00000000",

      // Set borders to white (unless covered by another section)
      "button.border": theme.white,
      "input.border": theme.white,
      "dropdown.border": theme.white,
      "editor.lineHighlightBorder": theme.white,
      "editor.selectionBackground": theme.white,
      "editor.findMatchHighlightBorder": theme.white, // another way to show would be nice

      // Panel
      "panelTitle.inactiveForeground": theme.white,
      "panelTitle.activeForeground": theme.white,

      // Badges
      "activityBarBadge.background": theme.white,
      "activityBarBadge.foreground": theme.black,
      "badge.background": theme.white,
      "badge.foreground": theme.black,

      // List
      "list.activeSelectionIconForeground": theme.background,
      "list.focusHighlightForeground": theme.foreground,
      "list.activeSelectionBackground": theme.white,
      "list.activeSelectionForeground": theme.background,
      "list.dropBackground": theme.white,
      "list.focusBackground": theme.white,
      "list.focusForeground": theme.black,
      "list.highlightForeground": theme.background,
      "list.hoverBackground": theme.white,
      "list.hoverForeground": theme.black,
      "list.inactiveSelectionBackground": theme.background,
      "list.inactiveSelectionForeground": theme.foreground,
      "list.inactiveSelectionIconForeground": theme.black,
      "list.matchHighlightBackground": theme.cursor,
      "list.matchHighlightForeground": theme.black,
      "list.selectionBackground": theme.white,
      "list.selectionForeground": theme.black,
      "list.selectionIconForeground": theme.black,
      "list.warningForeground": theme.cursor,

      // Inlay type inferences
      "editorInlayHint.background": "#000",
      "editorInlayHint.foreground": Color(theme.color1).lighten().toHexString(),

      // Editor tabs
      "tab.inactiveBackground": theme.black,
      "tab.inactiveForeground": theme.foreground,
      "tab.activeBackground": theme.background,
      "tab.activeForeground": theme.foreground,
      "tab.activeBorder": "#000",
      "editorGroupHeader.tabsBackground": theme.black,
      "sideBySideEditor.horizontalBorder": theme.black,
      "sideBySideEditor.verticalBorder": theme.black,

      // Errors
      "editorWarning.background": "#ffb51669",
      "editorError.background": "#ff000069",

      // Line nums
      "editorLineNumber.activeForeground": theme.background,
      "editorLineNumber.foreground": theme.foreground,

      // Peek view
      "peekView.border": theme.background,
      "peekViewEditor.background": theme.black,
      "peekViewResult.background": theme.background,
      "peekViewTitle.background": theme.background,
      "peekViewEditor.matchHighlightBackground": theme.white,
      "peekViewTitleDescription.foreground": theme.foreground,

      // Menu bar
      "menubar.selectionForeground": "#000",
      "menubar.selectionBackground": "#fff",
      "menu.border": "#000",

      // Notifications center
      "notificationCenter.border": "#fff",
      "notificationCenterHeader.background": "#000",
      "notificationCenterHeader.foreground": "#fff",

      // Notifications
      "notifications.background": theme.background,
      "notifications.foreground": theme.foreground,

      // Quick picker
      "quickInput.background": "#000",
      "quickInput.foreground": "#fff",
      "quickInputList.focusBackground": "#fff",
      "quickInputList.focusForeground": "#000",
      "quickInputList.focusIconForeground": "#000",
      "pickerGroup.border": "#fff",

      // Symbol icons (outline, breadcrumbs, suggest)
      "symbolIcon.classForeground": "#4EC9B0",
      "symbolIcon.structForeground": "#4EC9B0",
      "symbolIcon.enumeratorForeground": "#4EC9B0",
      "symbolIcon.enumeratorMemberForeground": "#9CDCFE",
      "symbolIcon.constantForeground": "#9CDCFE",
      "symbolIcon.moduleForeground": "#fff",
      "symbolIcon.functionForeground": "#FFEC8B",
      "symbolIcon.methodForeground": "#FFEC8B",
      "symbolIcon.objectForeground": "#F1644B", // impl block
      "symbolIcon.typeParameterForeground": "#4EC9B0",

      // Scrollbar
      "scrollbarSlider.background": "#ffffff69",
      "scrollbarSlider.hoverBackground": "#fff",
      "scrollbarSlider.activeBackground": "#fff",

      // Settings
      "keybindingTable.rowsBackground": "#000",
      "keybindingLabel.bottomBorder": "#000",

      // Keybinding label colors
      "keybindingLabel.foreground": "#000",
      "keybindingLabel.background": "#fff",
      "keybindingLabel.border": "#fff",

      // Terminal
      "terminal.findMatchBackground": "#fff",
      "terminal.findMatchHighlightBorder": "#ffffff69",
      "terminal.selectionForeground": "#000",
      "terminal.selectionBackground": "#fff",
      "terminal.foreground": "#fff",
      "terminal.background": "#000",

      // Widgets
      "editorWidget.border": "#fff",
      "editorWidget.background": "#000",
      "editorHoverWidget.background": "#000",
      "editorHoverWidget.foreground": "#fff",
      "editorHoverWidget.border": "#fff",

      // Jupyter
      "notebook.cellBorderColor": "#ffffff69",
      "notebook.focusedEditorBorder": "#fff",
      "notebook.outputContainerBorderColor": "#ffffff69",
    },

    "tokenColors": [
      {
        "scope": [
          "emphasis",
        ],
        "settings": {
          "fontStyle": "italic",
        },
      },
      {
        "scope": [
          "strong",
        ],
        "settings": {
          "fontStyle": "bold",
        },
      },
      {
        "scope": [
          "header",
        ],
        "settings": {
          "foreground": "#bf9eee",
        },
      },
      {
        "scope": [
          "meta.diff",
          "meta.diff.header",
        ],
        "settings": {
          "foreground": "#7b7f8b",
        },
      },
      {
        "scope": [
          "markup.inserted",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "scope": [
          "markup.deleted",
        ],
        "settings": {
          "foreground": "#ee6666",
        },
      },
      {
        "scope": [
          "markup.changed",
        ],
        "settings": {
          "foreground": "#FFB86C",
        },
      },
      {
        "scope": [
          "invalid",
        ],
        "settings": {
          "foreground": "#ee6666",
          "fontStyle": "underline italic",
        },
      },
      {
        "scope": [
          "invalid.deprecated",
        ],
        "settings": {
          "foreground": "#f6f6f4",
          "fontStyle": "underline italic",
        },
      },
      {
        "scope": [
          "entity.name.filename",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "scope": [
          "markup.error",
        ],
        "settings": {
          "foreground": "#ee6666",
        },
      },
      {
        "name": "Underlined markup",
        "scope": [
          "markup.underline",
        ],
        "settings": {
          "fontStyle": "underline",
        },
      },
      {
        "name": "Bold markup",
        "scope": [
          "markup.bold",
        ],
        "settings": {
          "fontStyle": "bold",
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "Markup headings",
        "scope": [
          "markup.heading",
        ],
        "settings": {
          "fontStyle": "bold",
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Markup italic",
        "scope": [
          "markup.italic",
        ],
        "settings": {
          "foreground": "#e7ee98",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Bullets, lists (prose)",
        "scope": [
          "beginning.punctuation.definition.list.markdown",
          "beginning.punctuation.definition.quote.markdown",
          "punctuation.definition.link.restructuredtext",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Inline code (prose)",
        "scope": [
          "markup.inline.raw",
          "markup.raw.restructuredtext",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "name": "Links (prose)",
        "scope": [
          "markup.underline.link",
          "markup.underline.link.image",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Link text, image alt text (prose)",
        "scope": [
          "meta.link.reference.def.restructuredtext",
          "punctuation.definition.directive.restructuredtext",
          "string.other.link.description",
          "string.other.link.title",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "Blockquotes (prose)",
        "scope": [
          "entity.name.directive.restructuredtext",
          "markup.quote",
        ],
        "settings": {
          "foreground": "#e7ee98",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Horizontal rule (prose)",
        "scope": [
          "meta.separator.markdown",
        ],
        "settings": {
          "foreground": "#7b7f8b",
        },
      },
      {
        "name": "Code blocks",
        "scope": [
          "fenced_code.block.language",
          "markup.raw.inner.restructuredtext",
          "markup.fenced_code.block.markdown punctuation.definition.markdown",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "name": "Prose constants",
        "scope": [
          "punctuation.definition.constant.restructuredtext",
        ],
        "settings": {
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Braces in markdown headings",
        "scope": [
          "markup.heading.markdown punctuation.definition.string.begin",
          "markup.heading.markdown punctuation.definition.string.end",
        ],
        "settings": {
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Braces in markdown paragraphs",
        "scope": [
          "meta.paragraph.markdown punctuation.definition.string.begin",
          "meta.paragraph.markdown punctuation.definition.string.end",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "Braces in markdown blockquotes",
        "scope": [
          "markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.begin",
          "markup.quote.markdown meta.paragraph.markdown punctuation.definition.string.end",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "User-defined class names",
        "scope": [
          "entity.name.type.class",
          "entity.name.class",
        ],
        "settings": {
          "foreground": "#97e1f1",
          "fontStyle": "normal",
        },
      },
      {
        "name": "this, super, self, etc.",
        "scope": [
          "keyword.expressions-and-types.swift",
          "keyword.other.this",
          "variable.language",
          "variable.language punctuation.definition.variable.php",
          "variable.other.readwrite.instance.ruby",
          "variable.parameter.function.language.special",
        ],
        "settings": {
          "foreground": "#bf9eee",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Inherited classes",
        "scope": [
          "entity.other.inherited-class",
        ],
        "settings": {
          "fontStyle": "italic",
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Comments",
        "scope": [
          "comment",
          "punctuation.definition.comment",
          "unused.comment",
          "wildcard.comment",
        ],
        "settings": {
          "foreground": "#7b7f8b",
        },
      },
      {
        "name": "JSDoc-style keywords",
        "scope": [
          "comment keyword.codetag.notation",
          "comment.block.documentation keyword",
          "comment.block.documentation storage.type.class",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "JSDoc-style types",
        "scope": [
          "comment.block.documentation entity.name.type",
        ],
        "settings": {
          "foreground": "#97e1f1",
          "fontStyle": "italic",
        },
      },
      {
        "name": "JSDoc-style type brackets",
        "scope": [
          "comment.block.documentation entity.name.type punctuation.definition.bracket",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "JSDoc-style comment parameters",
        "scope": [
          "comment.block.documentation variable",
        ],
        "settings": {
          "foreground": "#FFB86C",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Constants",
        "scope": [
          "constant",
          "variable.other.constant",
        ],
        "settings": {
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Constant escape sequences",
        "scope": [
          "constant.character.escape",
          "constant.character.string.escape",
          "constant.regexp",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "HTML tags",
        "scope": [
          "entity.name.tag",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "CSS attribute parent selectors ('&')",
        "scope": [
          "entity.other.attribute-name.parent-selector",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "HTML/CSS attribute names",
        "scope": [
          "entity.other.attribute-name",
        ],
        "settings": {
          "foreground": "#62e884",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Function names",
        "scope": [
          "entity.name.function",
          "meta.function-call.object",
          "meta.function-call.php",
          "meta.function-call.static",
          "meta.method-call.java meta.method",
          "meta.method.groovy",
          "support.function.any-method.lua",
          "keyword.operator.function.infix",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "name": "Function parameters",
        "scope": [
          "entity.name.variable.parameter",
          "meta.at-rule.function variable",
          "meta.at-rule.mixin variable",
          "meta.function.arguments variable.other.php",
          "meta.selectionset.graphql meta.arguments.graphql variable.arguments.graphql",
          "variable.parameter",
        ],
        "settings": {
          "fontStyle": "italic",
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "Decorators",
        "scope": [
          "meta.decorator variable.other.readwrite",
          "meta.decorator variable.other.property",
        ],
        "settings": {
          "foreground": "#62e884",
          "fontStyle": "italic",
        },
      },
      {
        "name": "Decorator Objects",
        "scope": [
          "meta.decorator variable.other.object",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "name": "Keywords",
        "scope": [
          "keyword",
          "punctuation.definition.keyword",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": 'Keyword "new"',
        "scope": [
          "keyword.control.new",
          "keyword.operator.new",
        ],
        "settings": {
          "fontStyle": "bold",
        },
      },
      {
        "name": "Generic selectors (CSS/SCSS/Less/Stylus)",
        "scope": [
          "meta.selector",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "Language Built-ins",
        "scope": [
          "support",
        ],
        "settings": {
          "fontStyle": "italic",
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Built-in magic functions and constants",
        "scope": [
          "support.function.magic",
          "support.variable",
          "variable.other.predefined",
        ],
        "settings": {
          "fontStyle": "regular",
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Built-in functions / properties",
        "scope": [
          "support.function",
          "support.type.property-name",
        ],
        "settings": {
          "fontStyle": "regular",
        },
      },
      {
        "name":
          "Separators (key/value, namespace, inheritance, pointer, hash, slice, etc)",
        "scope": [
          "constant.other.symbol.hashkey punctuation.definition.constant.ruby",
          "entity.other.attribute-name.placeholder punctuation",
          "entity.other.attribute-name.pseudo-class punctuation",
          "entity.other.attribute-name.pseudo-element punctuation",
          "meta.group.double.toml",
          "meta.group.toml",
          "meta.object-binding-pattern-variable punctuation.destructuring",
          "punctuation.colon.graphql",
          "punctuation.definition.block.scalar.folded.yaml",
          "punctuation.definition.block.scalar.literal.yaml",
          "punctuation.definition.block.sequence.item.yaml",
          "punctuation.definition.entity.other.inherited-class",
          "punctuation.function.swift",
          "punctuation.separator.dictionary.key-value",
          "punctuation.separator.hash",
          "punctuation.separator.inheritance",
          "punctuation.separator.key-value",
          "punctuation.separator.key-value.mapping.yaml",
          "punctuation.separator.namespace",
          "punctuation.separator.pointer-access",
          "punctuation.separator.slice",
          "string.unquoted.heredoc punctuation.definition.string",
          "support.other.chomping-indicator.yaml",
          "punctuation.separator.annotation",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "Brackets, braces, parens, etc.",
        "scope": [
          "keyword.operator.other.powershell",
          "keyword.other.statement-separator.powershell",
          "meta.brace.round",
          "meta.function-call punctuation",
          "punctuation.definition.arguments.begin",
          "punctuation.definition.arguments.end",
          "punctuation.definition.entity.begin",
          "punctuation.definition.entity.end",
          "punctuation.definition.tag.cs",
          "punctuation.definition.type.begin",
          "punctuation.definition.type.end",
          "punctuation.section.scope.begin",
          "punctuation.section.scope.end",
          "punctuation.terminator.expression.php",
          "storage.type.generic.java",
          "string.template meta.brace",
          "string.template punctuation.accessor",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "Variable interpolation operators",
        "scope": [
          "meta.string-contents.quoted.double punctuation.definition.variable",
          "punctuation.definition.interpolation.begin",
          "punctuation.definition.interpolation.end",
          "punctuation.definition.template-expression.begin",
          "punctuation.definition.template-expression.end",
          "punctuation.section.embedded.begin",
          "punctuation.section.embedded.coffee",
          "punctuation.section.embedded.end",
          "punctuation.section.embedded.end source.php",
          "punctuation.section.embedded.end source.ruby",
          "punctuation.definition.variable.makefile",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "Keys (serializable languages)",
        "scope": [
          "entity.name.function.target.makefile",
          "entity.name.section.toml",
          "entity.name.tag.yaml",
          "variable.other.key.toml",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Dates / timestamps (serializable languages)",
        "scope": [
          "constant.other.date",
          "constant.other.timestamp",
        ],
        "settings": {
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "YAML aliases",
        "scope": [
          "variable.other.alias.yaml",
        ],
        "settings": {
          "fontStyle": "italic underline",
          "foreground": "#62e884",
        },
      },
      {
        "name": "Storage",
        "scope": [
          "storage",
          "meta.implementation storage.type.objc",
          "meta.interface-or-protocol storage.type.objc",
          "source.groovy storage.type.def",
        ],
        "settings": {
          "fontStyle": "regular",
          "foreground": "#f286c4",
        },
      },
      {
        "name": "Types",
        "scope": [
          "entity.name.type",
          "keyword.primitive-datatypes.swift",
          "keyword.type.cs",
          "meta.protocol-list.objc",
          "meta.return-type.objc",
          "source.go storage.type",
          "source.groovy storage.type",
          "source.java storage.type",
          "source.powershell entity.other.attribute-name",
          "storage.class.std.rust",
          "storage.type.attribute.swift",
          "storage.type.c",
          "storage.type.core.rust",
          "storage.type.cs",
          "storage.type.groovy",
          "storage.type.objc",
          "storage.type.php",
          "storage.type.haskell",
          "storage.type.ocaml",
        ],
        "settings": {
          "fontStyle": "italic",
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Generics, templates, and mapped type declarations",
        "scope": [
          "entity.name.type.type-parameter",
          "meta.indexer.mappedtype.declaration entity.name.type",
          "meta.type.parameters entity.name.type",
        ],
        "settings": {
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "Modifiers",
        "scope": [
          "storage.modifier",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "RegExp string",
        "scope": [
          "string.regexp",
          "constant.other.character-class.set.regexp",
          "constant.character.escape.backslash.regexp",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "Non-capture operators",
        "scope": [
          "punctuation.definition.group.capture.regexp",
        ],
        "settings": {
          "foreground": "#f286c4",
        },
      },
      {
        "name": "RegExp start and end characters",
        "scope": [
          "string.regexp punctuation.definition.string.begin",
          "string.regexp punctuation.definition.string.end",
        ],
        "settings": {
          "foreground": "#ee6666",
        },
      },
      {
        "name": "Character group",
        "scope": [
          "punctuation.definition.character-class.regexp",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Capture groups",
        "scope": [
          "punctuation.definition.group.regexp",
        ],
        "settings": {
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "Assertion operators",
        "scope": [
          "punctuation.definition.group.assertion.regexp",
          "keyword.operator.negation.regexp",
        ],
        "settings": {
          "foreground": "#ee6666",
        },
      },
      {
        "name": "Positive lookaheads",
        "scope": [
          "meta.assertion.look-ahead.regexp",
        ],
        "settings": {
          "foreground": "#62e884",
        },
      },
      {
        "name": "Strings",
        "scope": [
          "string",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "String quotes (temporary vscode fix)",
        "scope": [
          "punctuation.definition.string.begin",
          "punctuation.definition.string.end",
        ],
        "settings": {
          "foreground": "#dee492",
        },
      },
      {
        "name": "Property quotes (temporary vscode fix)",
        "scope": [
          "punctuation.support.type.property-name.begin",
          "punctuation.support.type.property-name.end",
        ],
        "settings": {
          "foreground": "#97e2f2",
        },
      },
      {
        "name": "Docstrings",
        "scope": [
          "string.quoted.docstring.multi",
          "string.quoted.docstring.multi.python punctuation.definition.string.begin",
          "string.quoted.docstring.multi.python punctuation.definition.string.end",
          "string.quoted.docstring.multi.python constant.character.escape",
        ],
        "settings": {
          "foreground": "#7b7f8b",
        },
      },
      {
        "name": "Variables and object properties",
        "scope": [
          "variable",
          "constant.other.key.perl",
          "support.variable.property",
          "variable.other.constant.js",
          "variable.other.constant.ts",
          "variable.other.constant.tsx",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "Destructuring / aliasing reference name (LHS)",
        "scope": [
          "meta.import variable.other.readwrite",
          "meta.variable.assignment.destructured.object.coffee variable",
        ],
        "settings": {
          "fontStyle": "italic",
          "foreground": "#FFB86C",
        },
      },
      {
        "name": "Destructuring / aliasing variable name (RHS)",
        "scope": [
          "meta.import variable.other.readwrite.alias",
          "meta.export variable.other.readwrite.alias",
          "meta.variable.assignment.destructured.object.coffee variable variable",
        ],
        "settings": {
          "fontStyle": "normal",
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "GraphQL keys",
        "scope": [
          "meta.selectionset.graphql variable",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "GraphQL function arguments",
        "scope": [
          "meta.selectionset.graphql meta.arguments variable",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "GraphQL fragment name (definition)",
        "scope": [
          "entity.name.fragment.graphql",
          "variable.fragment.graphql",
        ],
        "settings": {
          "foreground": "#97e1f1",
        },
      },
      {
        "name": "Edge cases (foreground color resets)",
        "scope": [
          "constant.other.symbol.hashkey.ruby",
          "keyword.operator.dereference.java",
          "keyword.operator.navigation.groovy",
          "meta.scope.for-loop.shell punctuation.definition.string.begin",
          "meta.scope.for-loop.shell punctuation.definition.string.end",
          "meta.scope.for-loop.shell string",
          "storage.modifier.import",
          "punctuation.section.embedded.begin.tsx",
          "punctuation.section.embedded.end.tsx",
          "punctuation.section.embedded.begin.jsx",
          "punctuation.section.embedded.end.jsx",
          "punctuation.separator.list.comma.css",
          "constant.language.empty-list.haskell",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": 'Shell variables prefixed with "$" (edge case)',
        "scope": [
          "source.shell variable.other",
        ],
        "settings": {
          "foreground": "#bf9eee",
        },
      },
      {
        "name":
          "Powershell constants mistakenly scoped to `support`, rather than `constant` (edge)",
        "scope": [
          "support.constant",
        ],
        "settings": {
          "fontStyle": "normal",
          "foreground": "#bf9eee",
        },
      },
      {
        "name": "Makefile prerequisite names",
        "scope": [
          "meta.scope.prerequisites.makefile",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "SCSS attibute selector strings",
        "scope": [
          "meta.attribute-selector.scss",
        ],
        "settings": {
          "foreground": "#e7ee98",
        },
      },
      {
        "name": "SCSS attribute selector brackets",
        "scope": [
          "punctuation.definition.attribute-selector.end.bracket.square.scss",
          "punctuation.definition.attribute-selector.begin.bracket.square.scss",
        ],
        "settings": {
          "foreground": "#f6f6f4",
        },
      },
      {
        "name": "Haskell Pragmas",
        "scope": [
          "meta.preprocessor.haskell",
        ],
        "settings": {
          "foreground": "#7b7f8b",
        },
      },
      {
        "name": "Log file error",
        "scope": [
          "log.error",
        ],
        "settings": {
          "foreground": "#ee6666",
          "fontStyle": "bold",
        },
      },
      {
        "name": "Log file warning",
        "scope": [
          "log.warning",
        ],
        "settings": {
          "foreground": "#e7ee98",
          "fontStyle": "bold",
        },
      },
    ],
  };

  return JSON.stringify(vscodeTheme);
}

function getDarkThemeConf(colors) {
  const theme = generateTheme(colors, true);
  return generateThemeConfig(theme, true);
}

function getLightThemeConf(colors) {
  const theme = generateTheme(colors, false);
  return generateThemeConfig(theme, false);
}

function setTheme(
  themeConfPath,
) {
  const config = STD.loadFile(themeConfPath);
  const themeDir =
    "/.vscode/extensions/ssdev.wallwiz-theme-0.0.2/themes/wallwiz-theme.json";
  const vscodeThemeFile = STD.open(
    HOME_DIR.concat(themeDir),
    "w",
  );
  if (!vscodeThemeFile) return;
  vscodeThemeFile.puts(config);
  vscodeThemeFile.close();
}

export { getDarkThemeConf, getLightThemeConf, setTheme };
