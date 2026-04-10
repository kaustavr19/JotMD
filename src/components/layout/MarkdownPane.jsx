import CodeMirrorEditor from '../editor/CodeMirrorEditor'

export default function MarkdownPane({ content, setContent }) {
  return (
    <div className="h-full flex flex-col">
      <div
        className="px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          Markdown
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirrorEditor content={content} onChange={setContent} />
      </div>
    </div>
  )
}
