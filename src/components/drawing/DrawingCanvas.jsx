import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Canvas, PencilBrush } from 'fabric'
import { getPenCursor, getHighlighterCursor, getEraserCursor } from './cursors'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const DrawingCanvas = forwardRef(({ tool, penColor, highlighterColor }, ref) => {
  const containerRef  = useRef(null)
  const canvasElRef   = useRef(null)
  const fabricRef     = useRef(null)
  // Eraser state — managed via native pointer events (see note below)
  const isErasingRef  = useRef(false)
  // Keep latest tool in a ref so native listeners always see current value
  const toolRef       = useRef(tool)
  useEffect(() => { toolRef.current = tool }, [tool])

  useImperativeHandle(ref, () => ({
    clear: () => {
      const c = fabricRef.current
      if (!c) return
      c.clear()
      c.requestRenderAll()
    },
  }))

  // ── Initialize Fabric canvas ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = new Canvas(canvasElRef.current, {
      selection: false,
      isDrawingMode: false,
    })
    fabricRef.current = canvas

    if (containerRef.current) {
      canvas.setDimensions({
        width:  containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }

    return () => canvas.dispose()
  }, [])

  // ── Keep canvas sized to its container ──────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(() => {
      const c = fabricRef.current
      if (!c) return
      c.setDimensions({ width: container.offsetWidth, height: container.offsetHeight })
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // ── Eraser via native pointer events ─────────────────────────────────────
  // When isDrawingMode=false, Fabric sets its upper-canvas to
  // pointer-events:none, so canvas.on('mouse:*') never fires.
  // We attach native listeners directly to our container div instead.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function eraseAt(clientX, clientY) {
      const canvas = fabricRef.current
      const el     = canvasElRef.current
      if (!canvas || !el) return

      // Convert viewport coords → canvas-local coords
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const toRemove = canvas.getObjects().filter(obj => {
        const b = obj.getBoundingRect()
        return x >= b.left && x <= b.left + b.width &&
               y >= b.top  && y <= b.top  + b.height
      })
      if (toRemove.length) {
        toRemove.forEach(o => canvas.remove(o))
        canvas.requestRenderAll()
      }
    }

    function onPointerDown(e) {
      if (toolRef.current !== 'eraser') return
      isErasingRef.current = true
      eraseAt(e.clientX, e.clientY)
    }
    function onPointerMove(e) {
      if (toolRef.current !== 'eraser' || !isErasingRef.current) return
      eraseAt(e.clientX, e.clientY)
    }
    function onPointerUp() {
      isErasingRef.current = false
    }

    // capture:true so we intercept before any child element (incl. Fabric)
    container.addEventListener('pointerdown', onPointerDown, { capture: true })
    window.addEventListener('pointermove',   onPointerMove,  { capture: true })
    window.addEventListener('pointerup',     onPointerUp,    { capture: true })

    return () => {
      container.removeEventListener('pointerdown', onPointerDown, { capture: true })
      window.removeEventListener('pointermove',   onPointerMove,  { capture: true })
      window.removeEventListener('pointerup',     onPointerUp,    { capture: true })
    }
  }, []) // Attach once; toolRef keeps it current

  // ── Configure Fabric brush (pen / highlighter) ───────────────────────────
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    if (!tool || tool === 'eraser') {
      canvas.isDrawingMode = false
      return
    }

    canvas.isDrawingMode = true
    const brush = new PencilBrush(canvas)

    if (tool === 'highlighter') {
      brush.color         = hexToRgba(highlighterColor, 0.35)
      brush.width         = 14
      brush.strokeLineCap = 'square'
    } else {
      brush.color         = penColor
      brush.width         = 2.5
      brush.strokeLineCap = 'round'
    }

    canvas.freeDrawingBrush = brush
  }, [tool, penColor, highlighterColor])

  const cursor =
    tool === 'pen'         ? getPenCursor(penColor) :
    tool === 'highlighter' ? getHighlighterCursor(highlighterColor) :
    tool === 'eraser'      ? getEraserCursor() :
    'default'

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ pointerEvents: tool ? 'all' : 'none', cursor }}
    >
      <canvas ref={canvasElRef} />
    </div>
  )
})

DrawingCanvas.displayName = 'DrawingCanvas'
export default DrawingCanvas
