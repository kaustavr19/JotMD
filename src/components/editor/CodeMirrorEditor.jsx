import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'

// Theme uses CSS variables so it automatically responds to theme class changes
// on <html> without needing to know the active theme explicitly.
const baseTheme = EditorView.theme({
  '&': {
    height: '100%',
    background: 'var(--color-bg)',
  },
  '.cm-scroller': {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    lineHeight: '1.75',
    overflowY: 'auto',
  },
  '.cm-content': {
    padding: '24px 32px',
    caretColor: 'var(--color-text)',
    color: 'var(--color-text)',
  },
  '.cm-line': { padding: '0' },
  '&.cm-focused': { outline: 'none' },
  '.cm-cursor': { borderLeftColor: 'var(--color-text)' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--color-selection) !important',
  },
  '.cm-gutters': { display: 'none' },
})

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  EditorView.lineWrapping,
  baseTheme,
]

const setup = {
  lineNumbers:              false,
  foldGutter:               false,
  dropCursor:               false,
  allowMultipleSelections:  false,
  indentOnInput:            false,
  highlightActiveLine:      false,
  highlightSelectionMatches:false,
  bracketMatching:          false,
  closeBrackets:            false,
  autocompletion:           false,
  rectangularSelection:     false,
  crosshairCursor:          false,
  searchKeymap:             false,
}

export default function CodeMirrorEditor({ content, onChange }) {
  return (
    <div className="h-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <CodeMirror
        value={content}
        height="100%"
        theme="none"
        extensions={extensions}
        basicSetup={setup}
        onChange={onChange}
      />
    </div>
  )
}
