import { useEffect, useRef } from 'react'

const KEY_CONTENT = 'md-editor-content'
const KEY_TITLE   = 'md-editor-title'
const KEY_THEME   = 'md-editor-theme'

/** Load the last saved session from localStorage. Returns nulls if nothing saved. */
export function loadSession() {
  try {
    return {
      content: localStorage.getItem(KEY_CONTENT),
      title:   localStorage.getItem(KEY_TITLE),
      theme:   localStorage.getItem(KEY_THEME),
    }
  } catch {
    return { content: null, title: null, theme: null }
  }
}

/** Debounced autosave — writes to localStorage 1 s after the last change. */
export function useAutosave(content, title, theme) {
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(KEY_CONTENT, content)
        localStorage.setItem(KEY_TITLE,   title)
        localStorage.setItem(KEY_THEME,   theme)
      } catch {
        // localStorage may be unavailable (private browsing quota)
      }
    }, 1000)

    return () => clearTimeout(timer.current)
  }, [content, title, theme])
}
