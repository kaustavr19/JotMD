import { useRef, useState } from 'react'
import TiptapEditor from '../editor/TiptapEditor'
import DrawingCanvas from './DrawingCanvas'
import DrawingToolbar from './DrawingToolbar'

export default function DrawingLayer({ content, onChange }) {
  const [activeTool,       setActiveTool]       = useState(null)
  const [penColor,         setPenColor]         = useState('#000000')
  const [highlighterColor, setHighlighterColor] = useState('#FFFF00')
  const canvasRef = useRef(null)

  function handleToolClick(tool) {
    // Clicking the active tool deactivates it
    setActiveTool(prev => prev === tool ? null : tool)
  }

  return (
    <div className="relative h-full">
      <TiptapEditor content={content} onChange={onChange} />

      <DrawingCanvas
        ref={canvasRef}
        tool={activeTool}
        penColor={penColor}
        highlighterColor={highlighterColor}
      />

      <DrawingToolbar
        activeTool={activeTool}
        onToolClick={handleToolClick}
        penColor={penColor}
        setPenColor={setPenColor}
        highlighterColor={highlighterColor}
        setHighlighterColor={setHighlighterColor}
        onClear={() => canvasRef.current?.clear()}
      />
    </div>
  )
}
