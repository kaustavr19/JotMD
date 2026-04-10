import { useState, useEffect } from 'react'
import Toolbar from './components/toolbar/Toolbar'
import SplitPane from './components/layout/SplitPane'
import MarkdownPane from './components/layout/MarkdownPane'
import PreviewPane from './components/layout/PreviewPane'
import { MODES } from './constants'
import { loadSession, useAutosave } from './hooks/useAutosave'
import { exportMarkdown, exportPDF } from './utils/exportUtils'

const DEFAULT_CONTENT = `# Welcome to Markdown Editor

Start writing here. The preview updates in **real time**.

## Features
- Live preview as you type
- Split, Markdown, and Preview modes
- Clean, distraction-free interface

## Example

> "The best writing is rewriting." — E.B. White

\`\`\`js
const greet = name => \`Hello, \${name}!\`
console.log(greet('world'))
\`\`\`
`

const THEMES = ['light', 'dark', 'night']

// Restore last session once, before first render
const saved = loadSession()

export default function App() {
  const [mode,      setMode]      = useState(MODES.SPLIT)
  const [noteTitle, setNoteTitle] = useState(saved.title   ?? 'Untitled')
  const [content,   setContent]   = useState(saved.content ?? DEFAULT_CONTENT)
  const [theme,     setTheme]     = useState(saved.theme   ?? 'light')

  // Apply theme class to <html> so CSS variables cascade everywhere
  useEffect(() => {
    const html = document.documentElement
    THEMES.forEach(t => html.classList.remove(`theme-${t}`))
    html.classList.add(`theme-${theme}`)
  }, [theme])

  // Debounced autosave — 1 s after last change
  useAutosave(content, noteTitle, theme)

  function cycleTheme() {
    setTheme(prev => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length])
  }

  function handleImport(text, filename) {
    setContent(text)
    if (filename) setNoteTitle(filename)
  }

  return (
    <div
      className="h-screen flex flex-col font-inter overflow-hidden"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <Toolbar
        mode={mode}           setMode={setMode}
        noteTitle={noteTitle} setNoteTitle={setNoteTitle}
        theme={theme}         cycleTheme={cycleTheme}
        onImport={handleImport}
        onExportMd={() => exportMarkdown(content, noteTitle)}
        onExportPdf={() => exportPDF(content, noteTitle)}
      />
      <main className="flex-1 overflow-hidden">
        {mode === MODES.SPLIT    && <SplitPane    content={content} setContent={setContent} setMode={setMode} />}
        {mode === MODES.MARKDOWN && <MarkdownPane content={content} setContent={setContent} />}
        {mode === MODES.PREVIEW  && <PreviewPane  content={content} setContent={setContent} />}
      </main>
    </div>
  )
}
