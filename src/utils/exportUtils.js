import { marked } from 'marked'

/** Download the raw markdown as <title>.md */
export function exportMarkdown(content, title) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${title || 'Untitled'}.md` })
  a.click()
  URL.revokeObjectURL(url)
}

/** Render markdown on a clean white background and download as <title>.pdf */
export async function exportPDF(content, title) {
  const html2pdf = (await import('html2pdf.js')).default

  const container = document.createElement('div')
  Object.assign(container.style, {
    position:   'fixed',
    top:        '-9999px',
    left:       '-9999px',
    width:      '794px',   // A4 at 96 dpi
    background: '#ffffff',
    color:      '#1c1917',
    fontFamily: "'Inter', sans-serif",
    fontSize:   '14px',
    lineHeight: '1.75',
    padding:    '48px 56px',
  })

  // Inline prose CSS so the PDF is theme-independent
  const style = document.createElement('style')
  style.textContent = `
    h1 { font-size: 1.75rem; font-weight: 600; margin: 1.4em 0 0.4em; color: #0c0a09; }
    h2 { font-size: 1.35rem; font-weight: 600; margin: 1.2em 0 0.35em; color: #0c0a09; }
    h3 { font-size: 1.1rem;  font-weight: 600; margin: 1em 0 0.3em;   color: #0c0a09; }
    p  { margin: 0.5em 0; }
    ul, ol { padding-left: 1.5rem; margin: 0.5em 0; }
    ul { list-style-type: disc; }
    ol { list-style-type: decimal; }
    blockquote { border-left: 3px solid #d6d3d1; padding-left: 1rem; margin: 0.75em 0; color: #78716c; font-style: italic; }
    code { background: #f5f5f4; border-radius: 3px; padding: 0.1em 0.3em; font-size: 0.875em; font-family: monospace; }
    pre  { background: #1c1917; border-radius: 6px; padding: 0.9rem 1.1rem; margin: 0.75em 0; overflow: hidden; }
    pre code { background: none; color: #e7e5e4; font-size: 0.85em; }
    hr  { border: none; border-top: 1px solid #e7e5e4; margin: 1.5em 0; }
    strong { font-weight: 600; }
    a { color: #2563eb; }
  `
  container.appendChild(style)
  container.innerHTML += marked.parse(content || '')
  document.body.appendChild(container)

  try {
    await html2pdf()
      .set({
        margin:      0,
        filename:    `${title || 'Untitled'}.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF:       { unit: 'pt', format: 'a4', orientation: 'portrait' },
      })
      .from(container)
      .save()
  } finally {
    document.body.removeChild(container)
  }
}
