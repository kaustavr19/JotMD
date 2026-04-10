function enc(svg) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function getPenCursor(color = '#000000') {
  const outline = color === '#ffffff' ? '#000000' : 'white'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M18.5 2.5a2.121 2.121 0 013 3L7 20l-4 1 1-4L18.5 2.5z"
      fill="${color}" stroke="${outline}" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M15.5 5.5l3 3" stroke="${outline}" stroke-width="0.6"
      stroke-linecap="round" opacity="0.5"/>
  </svg>`
  return `${enc(svg)} 3 21, crosshair`
}

export function getHighlighterCursor(color = '#FFFF00') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect x="8" y="2" width="8" height="12" rx="2"
      fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="0.75"/>
    <path d="M9 14h6l-1.5 7H10.5L9 14z"
      fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" stroke-linejoin="round"/>
    <rect x="8" y="2" width="8" height="3.5" rx="2"
      fill="rgba(255,255,255,0.35)"/>
  </svg>`
  return `${enc(svg)} 12 21, crosshair`
}

export function getEraserCursor() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect x="2" y="9" width="20" height="12" rx="2.5"
      fill="#fef2f2" stroke="#d1d5db" stroke-width="1.25"/>
    <rect x="2" y="9" width="9" height="12" rx="2.5"
      fill="#fca5a5" stroke="#d1d5db" stroke-width="0.5"/>
    <path d="M2 15.5h20" stroke="#d1d5db" stroke-width="0.75"/>
  </svg>`
  return `${enc(svg)} 11 15, cell`
}
