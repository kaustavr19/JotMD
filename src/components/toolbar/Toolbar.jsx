import { useState, useRef, useEffect } from 'react'
import { MODES } from '../../constants'

// ── Icons ─────────────────────────────────────────────────────────────────────
function SplitIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
}
function MarkdownIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6v4M4 10l2-2 2 2M10 10V6l1.5 1.5L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function PreviewIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M4 5.5h8M4 8h6M4 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function SunIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.07 1.07M11.53 11.53l1.07 1.07M3.4 12.6l1.07-1.07M11.53 4.47l1.07-1.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function MoonIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13.5 10A6 6 0 016 2.5a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function WarmIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2v1M8 13v1M3 8H2M14 8h-1M4.5 4.5l-.7-.7M12.2 11.8l-.7-.7M11.8 4.5l.7-.7M4.2 11.8l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function ImportIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function ExportIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 10V2M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function ChevronIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

const THEME_META = {
  light: { Icon: SunIcon,  label: 'Light'      },
  dark:  { Icon: MoonIcon, label: 'Dark'        },
  night: { Icon: WarmIcon, label: 'Night light' },
}

const modeButtons = [
  { id: MODES.SPLIT,    label: 'Split',    Icon: SplitIcon },
  { id: MODES.MARKDOWN, label: 'Markdown', Icon: MarkdownIcon },
  { id: MODES.PREVIEW,  label: 'Preview',  Icon: PreviewIcon },
]

// ── Toolbar ───────────────────────────────────────────────────────────────────
export default function Toolbar({
  mode, setMode,
  noteTitle, setNoteTitle,
  theme, cycleTheme,
  onImport, onExportMd, onExportPdf,
}) {
  const [editing,        setEditing]        = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [exportingPdf,   setExportingPdf]   = useState(false)

  const titleRef     = useRef(null)
  const importRef    = useRef(null)
  const exportBtnRef = useRef(null)

  useEffect(() => { if (editing) titleRef.current?.select() }, [editing])

  // Close export dropdown on outside click
  useEffect(() => {
    function onDown(e) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(e.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'Escape') setEditing(false)
  }

  function handleImportFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onImport(ev.target.result, file.name.replace(/\.md$/i, ''))
    reader.readAsText(file)
    e.target.value = ''   // allow re-importing the same file
  }

  async function handleExportPdf() {
    setShowExportMenu(false)
    setExportingPdf(true)
    try { await onExportPdf() } finally { setExportingPdf(false) }
  }

  const { Icon: ThemeIcon, label: themeLabel } = THEME_META[theme] ?? THEME_META.light

  // Shared icon-button hover style helpers
  const iconBtn = { color: 'var(--color-text-subtle)' }
  const onHoverIn  = e => { e.currentTarget.style.background = 'var(--color-surface-subtle)' }
  const onHoverOut = e => { e.currentTarget.style.background = 'transparent' }

  return (
    <header
      className="flex items-center justify-between px-4 h-11 border-b shrink-0 gap-4"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* ── Note title ── */}
      <div className="flex items-center min-w-0">
        {editing ? (
          <input
            ref={titleRef}
            value={noteTitle}
            onChange={e => setNoteTitle(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={handleTitleKeyDown}
            className="text-sm font-medium border-b outline-none bg-transparent w-44"
            style={{ color: 'var(--color-text)', borderColor: 'var(--color-text-subtle)' }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Click to rename"
            className="text-sm font-medium truncate max-w-[11rem] transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {noteTitle}
          </button>
        )}
      </div>

      {/* ── Mode switcher ── */}
      <div className="flex items-center gap-0.5 rounded-md p-0.5" style={{ background: 'var(--color-surface-subtle)' }}>
        {modeButtons.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            title={label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all"
            style={mode === id
              ? { background: 'var(--color-surface)', color: 'var(--color-text)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
              : { color: 'var(--color-text-subtle)' }}
          >
            <Icon />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button onClick={cycleTheme} title={`Theme: ${themeLabel}`}
          className="p-1.5 rounded transition-colors" style={iconBtn}
          onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
          <ThemeIcon />
        </button>

        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--color-border)' }} />

        {/* Import */}
        <button
          onClick={() => importRef.current?.click()}
          title="Import .md file"
          className="p-1.5 rounded transition-colors" style={iconBtn}
          onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
        >
          <ImportIcon />
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".md,text/markdown,text/plain"
          className="hidden"
          onChange={handleImportFile}
        />

        {/* Export dropdown */}
        <div ref={exportBtnRef} className="relative">
          <button
            onClick={() => setShowExportMenu(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors"
            style={{ background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
          >
            <ExportIcon />
            {exportingPdf ? 'Generating…' : 'Export'}
            <ChevronIcon />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-40 rounded-lg border shadow-lg overflow-hidden z-50"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => { onExportMd(); setShowExportMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                style={{ color: 'var(--color-text)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded" style={{ background: 'var(--color-surface-subtle)', color: 'var(--color-text-muted)' }}>.md</span>
                Markdown file
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                style={{ color: 'var(--color-text)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded" style={{ background: 'var(--color-surface-subtle)', color: 'var(--color-text-muted)' }}>.pdf</span>
                PDF document
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
