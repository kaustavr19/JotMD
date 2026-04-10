import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const ICONS = {
  'Heading 1':     { label: 'H1' },
  'Heading 2':     { label: 'H2' },
  'Heading 3':     { label: 'H3' },
  'Bullet List':   { label: '•'  },
  'Numbered List': { label: '1.' },
  'Blockquote':    { label: '"'  },
  'Code Block':    { label: '</>' },
  'Divider':       { label: '—'  },
}

const SlashMenu = forwardRef(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp')   { setSelectedIndex(i => (i - 1 + items.length) % items.length); return true }
      if (event.key === 'ArrowDown') { setSelectedIndex(i => (i + 1) % items.length); return true }
      if (event.key === 'Enter')     { if (items[selectedIndex]) command(items[selectedIndex]); return true }
      return false
    },
  }))

  if (!items.length) return null

  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden w-60 py-1 z-50 border"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <p
        className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        Insert
      </p>
      {items.map((item, index) => {
        const icon = ICONS[item.title] ?? { label: item.title[0] }
        const isSelected = index === selectedIndex
        return (
          <button
            key={index}
            onClick={() => command(item)}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors"
            style={{
              background: isSelected ? 'var(--color-surface-subtle)' : 'transparent',
              color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
          >
            <span
              className="w-7 h-7 flex items-center justify-center rounded text-xs font-mono font-bold shrink-0"
              style={{ background: 'var(--color-surface-subtle)', color: 'var(--color-text-muted)' }}
            >
              {icon.label}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight">{item.title}</div>
              <div className="text-xs truncate" style={{ color: 'var(--color-text-subtle)' }}>
                {item.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
})

SlashMenu.displayName = 'SlashMenu'
export default SlashMenu
