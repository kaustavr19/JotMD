import { useMemo } from 'react'
import { marked } from 'marked'

marked.use({ gfm: true, breaks: true })

export default function MarkdownPreview({ content }) {
  const html = useMemo(() => marked.parse(content || ''), [content])

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div
        className="prose prose-stone max-w-none px-8 py-6 prose-headings:font-semibold prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
