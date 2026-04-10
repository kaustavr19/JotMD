import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { slashExtension } from './slashExtension'

export default function TiptapEditor({ content, onChange }) {
  const isTiptapUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ html: false, transformPastedText: true, transformCopiedText: true }),
      Placeholder.configure({ placeholder: 'Start writing, or type / for commands…' }),
      slashExtension,
    ],
    content,
    editorProps: {
      attributes: { class: 'tiptap-prose focus:outline-none' },
    },
    onUpdate: ({ editor }) => {
      isTiptapUpdate.current = true
      onChange(editor.storage.markdown.getMarkdown())
    },
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (isTiptapUpdate.current) { isTiptapUpdate.current = false; return }
    const current = editor.storage.markdown.getMarkdown()
    if (current !== content) editor.commands.setContent(content, false)
  }, [content, editor])

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-surface)' }}>
      <EditorContent editor={editor} className="min-h-full px-8 py-6" />
    </div>
  )
}
