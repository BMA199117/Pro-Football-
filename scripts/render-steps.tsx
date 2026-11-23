// Dev helper: renders every step of a drill animation (mid-move, with that step's arrows) to one HTML page.
import React from "react"; (globalThis as any).React = React
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { BOOK_SCENES } from '../src/book/index'
import { BookFrame, BookStatic } from '../src/components/BookPitch'
import { narrate } from '../src/book/narrate'
import { bookSteps } from '../src/book/scene'
const [out, ...ids] = process.argv.slice(2)
let html = '<html><meta charset="utf-8"><body style="margin:0;font:11px sans-serif;background:#fff">'
for (const id of ids) {
  const sc = BOOK_SCENES[id]
  if (!sc) { html += `<p>no ${id}</p>`; continue }
  const st = narrate(sc, 'uz')
  html += `<div style="display:flex;flex-wrap:wrap;gap:4px;border-bottom:3px solid #000;padding:4px"><div style="width:100%;font-weight:bold">${id} (book ${bookSteps(sc)} / ${sc.steps})</div>`
  html += `<div style="width:300px">${renderToStaticMarkup(<BookStatic scene={sc} />)}<br>book drawing</div>`
  for (let k = 0; k < sc.steps - 1; k++) {
    html += `<div style="width:300px">${renderToStaticMarkup(<BookFrame scene={sc} t={k + 0.55} step={k} />)}<br><b>${k + 1}${k >= bookSteps(sc) - 1 ? ' D' : ''}.</b> ${(st[k] ?? []).join(' ')}</div>`
  }
  html += '</div>'
}
writeFileSync(out, html + '</body></html>')
