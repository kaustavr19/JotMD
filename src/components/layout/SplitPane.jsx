import { MODES } from '../../constants'
import CodeMirrorEditor from '../editor/CodeMirrorEditor'
import DrawingLayer from '../drawing/DrawingLayer'

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M10 2h4v4M6 14H2v-4M14 2l-5.5 5.5M2 14l5.5-5.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PaneHeader({ label, onExpand, expandTitle }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b shrink-0"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-widest select-none"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        {label}
      </span>
      <button
        onClick={onExpand}
        title={expandTitle}
        className="p-0.5 rounded transition-all opacity-30 hover:opacity-80"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        <ExpandIcon />
      </button>
    </div>
  )
}

export default function SplitPane({ content, setContent, setMode }) {
  return (
    <div className="h-full flex">
      {/* Left: raw markdown editor */}
      <div
        className="flex-1 flex flex-col min-w-0 border-r"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <PaneHeader
          label="Markdown"
          expandTitle="Expand to fullscreen markdown editor"
          onExpand={() => setMode(MODES.MARKDOWN)}
        />
        <div className="flex-1 overflow-hidden">
          <CodeMirrorEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Right: WYSIWYG + drawing layer */}
      <div className="flex-1 flex flex-col min-w-0">
        <PaneHeader
          label="Preview"
          expandTitle="Expand to fullscreen preview"
          onExpand={() => setMode(MODES.PREVIEW)}
        />
        <div className="flex-1 overflow-hidden relative">
          <DrawingLayer content={content} onChange={setContent} />
        </div>
      </div>
    </div>
  )
}
