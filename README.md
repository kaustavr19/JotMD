# JotMD

A clean, distraction-free markdown editor with a live WYSIWYG preview, a Fabric.js drawing layer, three themes, and full import/export support — all in the browser with no backend.

---

## Features

### Three view modes
| Mode | Description |
|---|---|
| **Split** | Raw markdown on the left, rendered preview on the right |
| **Markdown** | Fullscreen CodeMirror raw editor |
| **Preview** | Fullscreen WYSIWYG editor (Tiptap) |

Click the expand icon (⤢) in either pane header to jump to its fullscreen mode. Switch back with the mode buttons in the toolbar.

### Dual editor with live sync
- **Left pane — CodeMirror 6**: syntax-highlighted raw markdown with line wrapping
- **Right pane — Tiptap v2**: rich WYSIWYG editor backed by `tiptap-markdown` for bidirectional markdown sync
- Edits in either pane are reflected in the other instantly, with loop-prevention so changes don't echo back

### Slash commands
Type `/` anywhere in the WYSIWYG pane to open a floating command menu. Navigate with arrow keys, select with Enter, dismiss with Escape.

| Command | Result |
|---|---|
| `/heading 1` | H1 — large section heading |
| `/heading 2` | H2 — medium section heading |
| `/heading 3` | H3 — small section heading |
| `/bullet` | Unordered bullet list |
| `/numbered` | Ordered numbered list |
| `/blockquote` | Indented quote block |
| `/code` | Fenced code block |
| `/divider` | Horizontal rule |

### Drawing layer
A Fabric.js canvas overlays the preview pane. A floating pill toolbar at the bottom provides:

- **Pen** — freehand drawing; 4 colors (Black, Blue, Red, Green)
- **Highlighter** — semi-transparent strokes; 5 colors (Yellow, Green, Pink, Orange, Blue)
- **Eraser** — erase strokes by drawing over them
- **Clear** — remove all strokes at once

The color picker slides in above the toolbar when Pen or Highlighter is active. Clicking the active tool button again deactivates it (no-draw mode).

### Themes
Three themes cycle through the toolbar's theme button:

| Theme | Description |
|---|---|
| **Light** | Stone-white background, dark text |
| **Dark** | Deep charcoal background, light text |
| **Night Light** | Warm sepia tones — easy on the eyes at night |

Themes are applied as a class on `<html>` via CSS custom properties so every element — including Tippy.js popups appended to `<body>` — inherits them. Code blocks always render in a dark terminal style regardless of theme.

### Autosave
Content, note title, and active theme are debounce-saved to `localStorage` 1 second after the last change. The session is restored automatically on next load.

### Import / Export
- **Import** — open any `.md` file; the filename becomes the note title
- **Export → Markdown** — downloads the raw markdown as a `.md` file
- **Export → PDF** — renders the markdown to HTML and uses `html2pdf.js` to produce a clean, white-background PDF (theme-independent)

---

## Tech stack

| Layer | Library / Tool |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Raw editor | CodeMirror 6 via `@uiw/react-codemirror` |
| WYSIWYG editor | Tiptap v2 (`@tiptap/react`, `@tiptap/starter-kit`) |
| MD↔rich sync | `tiptap-markdown` |
| Slash menu | `@tiptap/suggestion` + `tippy.js` |
| Drawing | Fabric.js v7 |
| PDF export | `html2pdf.js` (dynamic import) |
| Fonts | Inter via `@fontsource/inter` |

---

## Project structure

```
src/
├── App.jsx                        # Root — mode, theme, title, content state
├── constants.js                   # MODES enum (SPLIT | MARKDOWN | PREVIEW)
├── index.css                      # CSS variables for all themes, Tiptap prose styles
├── main.jsx                       # React entry point
│
├── components/
│   ├── toolbar/
│   │   └── Toolbar.jsx            # Top bar: title, mode switcher, theme, import, export
│   │
│   ├── layout/
│   │   ├── SplitPane.jsx          # Side-by-side CodeMirror + DrawingLayer
│   │   ├── MarkdownPane.jsx       # Fullscreen CodeMirror
│   │   └── PreviewPane.jsx        # Fullscreen DrawingLayer (Tiptap + canvas)
│   │
│   ├── editor/
│   │   ├── CodeMirrorEditor.jsx   # Theme-aware CodeMirror 6 wrapper
│   │   ├── TiptapEditor.jsx       # Tiptap WYSIWYG with markdown sync
│   │   ├── SlashMenu.jsx          # Keyboard-navigable slash command list
│   │   ├── slashExtension.js      # Tiptap Extension + Suggestion plugin
│   │   └── MarkdownPreview.jsx    # Read-only rendered markdown (marked.js)
│   │
│   └── drawing/
│       ├── DrawingLayer.jsx       # Composes TiptapEditor + DrawingCanvas + DrawingToolbar
│       ├── DrawingCanvas.jsx      # Fabric.js canvas with pen / highlighter / eraser
│       ├── DrawingToolbar.jsx     # Floating pill: tool buttons + color swatches
│       └── cursors.js             # SVG cursor data URIs for each drawing tool
│
├── hooks/
│   └── useAutosave.js             # loadSession() + debounced localStorage autosave
│
└── utils/
    └── exportUtils.js             # exportMarkdown() + exportPDF()
```

---

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+

### Install and run

```bash
git clone https://github.com/kaustavr19/JotMD.git
cd JotMD
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate slash command menu |
| `Enter` | Execute selected slash command |
| `Escape` | Dismiss slash command menu |
| Standard markdown shortcuts | Bold (`**`), italic (`_`), code (`` ` ``), etc. work natively in Tiptap |

---

## Known behaviour

- **Drawing strokes are not persisted** — they live only for the current session. Refreshing the page clears the canvas. The markdown content and theme are saved; drawings are not.
- **PDF export ignores the active theme** — the PDF always renders with a white background for clean printing.
- **CodeMirror and Tiptap stay in sync** but the sync is one-at-a-time: whichever pane was edited last wins. There is no merge/conflict resolution.
