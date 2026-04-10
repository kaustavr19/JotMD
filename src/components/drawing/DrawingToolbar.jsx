const PEN_COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#2563eb', label: 'Blue'  },
  { value: '#dc2626', label: 'Red'   },
  { value: '#16a34a', label: 'Green' },
]

const HIGHLIGHTER_COLORS = [
  { value: '#FFFF00', label: 'Yellow' },
  { value: '#39FF14', label: 'Green'  },
  { value: '#FF6EC7', label: 'Pink'   },
  { value: '#FF6700', label: 'Orange' },
  { value: '#00FFFF', label: 'Blue'   },
]

function PenIcon({ color = 'currentColor' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5l-5 1 1-5L17 3z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HighlighterIcon({ color = 'currentColor' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12.22 3.45l4.33 4.33-8.28 8.28H3.94v-4.33l8.28-8.28z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={color} fillOpacity="0.15" />
    </svg>
  )
}

function EraserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M20 20H7L3 16l12-12 7 7-2 9z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 17.5l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ToolButton({ active, onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-full transition-colors"
      style={
        active
          ? { background: 'var(--color-accent)', color: 'var(--color-accent-fg)' }
          : { color: 'var(--color-text-muted)' }
      }
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-surface-subtle)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function ColorSwatch({ value, label, selected, onSelect }) {
  const needsBorder = ['#FFFF00', '#00FFFF', '#39FF14'].includes(value)
  return (
    <button
      onClick={() => onSelect(value)}
      title={label}
      className={`w-5 h-5 rounded-full transition-all ${selected ? 'scale-125 ring-2 ring-offset-1 ring-stone-400' : 'hover:scale-110'}`}
      style={{ backgroundColor: value, border: needsBorder ? '1px solid #d1d5db' : 'none' }}
    />
  )
}

export default function DrawingToolbar({
  activeTool, onToolClick,
  penColor, setPenColor,
  highlighterColor, setHighlighterColor,
  onClear,
}) {
  const showColors    = activeTool === 'pen' || activeTool === 'highlighter'
  const colors        = activeTool === 'pen' ? PEN_COLORS : HIGHLIGHTER_COLORS
  const selectedColor = activeTool === 'pen' ? penColor : highlighterColor
  const setColor      = activeTool === 'pen' ? setPenColor : setHighlighterColor

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">

      {/* Color picker — always above toolbar, fades in/out */}
      <div
        className={`flex items-center gap-2 border rounded-full shadow-md px-3 py-1.5 pointer-events-auto transition-all duration-150 ${
          showColors ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-1'
        }`}
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {colors.map(c => (
          <ColorSwatch key={c.value} value={c.value} label={c.label}
            selected={selectedColor === c.value} onSelect={setColor} />
        ))}
      </div>

      {/* Tool buttons */}
      <div
        className="flex items-center gap-0.5 border rounded-full shadow-md px-2 py-1.5 pointer-events-auto backdrop-blur-sm"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <ToolButton active={activeTool === 'pen'} onClick={() => onToolClick('pen')} title="Pen">
          <PenIcon color={activeTool === 'pen' ? penColor : 'currentColor'} />
        </ToolButton>

        <ToolButton active={activeTool === 'highlighter'} onClick={() => onToolClick('highlighter')} title="Highlighter">
          <HighlighterIcon color={activeTool === 'highlighter' ? highlighterColor : 'currentColor'} />
        </ToolButton>

        <ToolButton active={activeTool === 'eraser'} onClick={() => onToolClick('eraser')} title="Eraser">
          <EraserIcon />
        </ToolButton>

        <div className="w-px h-4 mx-1" style={{ background: 'var(--color-border)' }} />

        <button
          onClick={onClear}
          title="Clear all drawings"
          className="px-2 py-1 text-[11px] font-medium rounded-full transition-colors"
          style={{ color: 'var(--color-text-subtle)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
