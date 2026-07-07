import type { Monaco } from "@monaco-editor/react";

export const getEditorLanguage = (fileExtension: string): string => {
  const extension = fileExtension.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    py: "python",
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    sh: "shell",
    bash: "shell",
    sql: "sql",
    toml: "ini",
    ini: "ini",
    conf: "ini",
    dockerfile: "dockerfile",
  };

  return languageMap[extension] || "plaintext";
};

export const configureMonaco = (monaco: Monaco) => {
  // Obsidian Studio theme — deep blue-black with violet/cyan accents
  monaco.editor.defineTheme("obsidian-studio", {
    base: "vs-dark",
    inherit: true,
    rules: [
      // Comments
      { token: "comment", foreground: "6B7394", fontStyle: "italic" },
      { token: "comment.line", foreground: "6B7394", fontStyle: "italic" },
      { token: "comment.block", foreground: "6B7394", fontStyle: "italic" },

      // Keywords — violet
      { token: "keyword", foreground: "B07AFF", fontStyle: "bold" },
      { token: "keyword.control", foreground: "B07AFF", fontStyle: "bold" },
      { token: "keyword.operator", foreground: "C8D0E0" },

      // Strings — warm amber
      { token: "string", foreground: "E8B87A" },
      { token: "string.quoted", foreground: "E8B87A" },
      { token: "string.template", foreground: "E8B87A" },

      // Numbers — cyan
      { token: "number", foreground: "7ECDC0" },
      { token: "number.hex", foreground: "7ECDC0" },
      { token: "number.float", foreground: "7ECDC0" },

      // Functions — soft blue
      { token: "entity.name.function", foreground: "7AA2F7" },
      { token: "support.function", foreground: "7AA2F7" },

      // Variables — light blue
      { token: "variable", foreground: "A9B7E6" },
      { token: "variable.parameter", foreground: "A9B7E6" },
      { token: "variable.other", foreground: "A9B7E6" },

      // Types — teal
      { token: "entity.name.type", foreground: "7ECDC0" },
      { token: "support.type", foreground: "7ECDC0" },
      { token: "storage.type", foreground: "B07AFF" },

      // Classes — teal
      { token: "entity.name.class", foreground: "7ECDC0" },
      { token: "support.class", foreground: "7ECDC0" },

      // Constants — cyan
      { token: "constant", foreground: "7AA2F7" },
      { token: "constant.language", foreground: "B07AFF" },
      { token: "constant.numeric", foreground: "7ECDC0" },

      // Operators
      { token: "keyword.operator", foreground: "C8D0E0" },
      { token: "punctuation", foreground: "8892B0" },

      // HTML/XML
      { token: "tag", foreground: "B07AFF" },
      { token: "tag.id", foreground: "A9B7E6" },
      { token: "tag.class", foreground: "7ECDC0" },
      { token: "attribute.name", foreground: "A9B7E6" },
      { token: "attribute.value", foreground: "E8B87A" },

      // CSS
      { token: "attribute.name.css", foreground: "A9B7E6" },
      { token: "attribute.value.css", foreground: "E8B87A" },
      { token: "property-name.css", foreground: "A9B7E6" },
      { token: "property-value.css", foreground: "E8B87A" },

      // JSON
      { token: "key", foreground: "A9B7E6" },
      { token: "string.key", foreground: "A9B7E6" },
      { token: "string.value", foreground: "E8B87A" },

      // Error/Warning
      { token: "invalid", foreground: "F76E6E", fontStyle: "underline" },
      { token: "invalid.deprecated", foreground: "8892B0", fontStyle: "strikethrough" },
    ],
    colors: {
      // Editor background — deep blue-black
      "editor.background": "#0F1219",
      "editor.foreground": "#C8D0E0",

      // Line numbers
      "editorLineNumber.foreground": "#3D4566",
      "editorLineNumber.activeForeground": "#C8D0E0",

      // Cursor — violet
      "editorCursor.foreground": "#B07AFF",

      // Selection
      "editor.selectionBackground": "#2A1F4D80",
      "editor.selectionHighlightBackground": "#B07AFF15",
      "editor.inactiveSelectionBackground": "#2A1F4D40",

      // Current line
      "editor.lineHighlightBackground": "#151A24",
      "editor.lineHighlightBorder": "#1C2230",

      // Gutter
      "editorGutter.background": "#0F1219",
      "editorGutter.modifiedBackground": "#B07AFF30",
      "editorGutter.addedBackground": "#7ECDC030",
      "editorGutter.deletedBackground": "#F76E6E30",

      // Scrollbar
      "scrollbar.shadow": "#00000040",
      "scrollbarSlider.background": "#3D456640",
      "scrollbarSlider.hoverBackground": "#3D456660",
      "scrollbarSlider.activeBackground": "#3D456680",

      // Minimap
      "minimap.background": "#0C0F14",
      "minimap.selectionHighlight": "#2A1F4D80",

      // Find/Replace
      "editor.findMatchBackground": "#E8B87A60",
      "editor.findMatchHighlightBackground": "#E8B87A30",
      "editor.findRangeHighlightBackground": "#7ECDC020",

      // Word highlight
      "editor.wordHighlightBackground": "#3D456640",
      "editor.wordHighlightStrongBackground": "#B07AFF20",

      // Brackets
      "editorBracketMatch.background": "#B07AFF15",
      "editorBracketMatch.border": "#3D4566",

      // Indentation guides
      "editorIndentGuide.background": "#1C2230",
      "editorIndentGuide.activeBackground": "#2A2F40",

      // Ruler
      "editorRuler.foreground": "#1C2230",

      // Whitespace
      "editorWhitespace.foreground": "#3D456640",

      // Error/Warning squiggles
      "editorError.foreground": "#F76E6E",
      "editorWarning.foreground": "#E8B87A",
      "editorInfo.foreground": "#7AA2F7",
      "editorHint.foreground": "#7ECDC0",

      // Suggest widget
      "editorSuggestWidget.background": "#151A24",
      "editorSuggestWidget.border": "#1C2230",
      "editorSuggestWidget.foreground": "#C8D0E0",
      "editorSuggestWidget.selectedBackground": "#1C2230",

      // Hover widget
      "editorHoverWidget.background": "#151A24",
      "editorHoverWidget.border": "#1C2230",

      // Panel
      "panel.background": "#0F1219",
      "panel.border": "#1C2230",

      // Activity bar
      "activityBar.background": "#0C0F14",
      "activityBar.foreground": "#C8D0E0",
      "activityBar.border": "#1C2230",

      // Side bar
      "sideBar.background": "#0C0F14",
      "sideBar.foreground": "#C8D0E0",
      "sideBar.border": "#1C2230",
    },
  });

  monaco.editor.setTheme("obsidian-studio");

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });
};

export const defaultEditorOptions = {
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  fontLigatures: true,
  fontWeight: "400",

  minimap: {
    enabled: true,
    size: "proportional",
    showSlider: "mouseover",
  },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },

  lineNumbers: "on",
  lineHeight: 22,
  renderLineHighlight: "all",
  renderWhitespace: "selection",

  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,

  wordWrap: "on",
  wordWrapColumn: 120,
  wrappingIndent: "indent",

  folding: true,
  foldingHighlight: true,
  foldingStrategy: "indentation",
  showFoldingControls: "mouseover",

  smoothScrolling: true,
  mouseWheelZoom: true,
  fastScrollSensitivity: 5,

  multiCursorModifier: "ctrlCmd",
  selectionHighlight: true,
  occurrencesHighlight: true,

  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on",
  tabCompletion: "on",
  wordBasedSuggestions: true,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: false,
  },

  formatOnPaste: true,
  formatOnType: true,

  matchBrackets: "always",
  bracketPairColorization: {
    enabled: true,
  },

  renderIndentGuides: true,
  highlightActiveIndentGuide: true,
  rulers: [80, 120],

  disableLayerHinting: false,
  disableMonospaceOptimizations: false,

  accessibilitySupport: "auto",

  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: true,
  cursorStyle: "line",
  cursorWidth: 2,

  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: "always",
  },

  hover: {
    enabled: true,
    delay: 300,
    sticky: true,
  },

  "semanticHighlighting.enabled": true,

  stickyScroll: {
    enabled: true,
  },
};
