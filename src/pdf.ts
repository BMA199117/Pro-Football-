import { inTelegram, sendPdfToChat, tgApp } from './telegram'
import { getPrefs } from './store'
import { tr } from './i18n'
/**
 * Real PDF file from a printable sheet (no print dialog): each block of the sheet is drawn to a
 * picture and laid out on A4 pages, a block that does not fit goes to the next page whole.
 * The libraries are loaded only when the coach presses the button.
 */
export async function sheetToPdf(sheet: HTMLElement, fileName: string, caption?: string): Promise<void> {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')])
  // let the drawings lay out
  await new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 120)))
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  const PW = 210, PH = 297, M = 12, W = PW - 2 * M
  const scale = W / sheet.clientWidth
  const room = PH - 2 * M
  let y = M
  const place = (src: HTMLCanvasElement, sy: number, sh: number) => {
    const piece = document.createElement('canvas')
    piece.width = src.width; piece.height = Math.max(1, Math.round(sh))
    piece.getContext('2d')!.drawImage(src, 0, sy, src.width, sh, 0, 0, src.width, sh)
    const h = (sh / 2) * scale
    if (y + h > PH - M && y > M) { pdf.addPage(); y = M }
    pdf.addImage(piece.toDataURL('image/jpeg', 0.9), 'JPEG', M, y, W, h)
    y += h + 2.5
  }
  for (const el of Array.from(sheet.children) as HTMLElement[]) {
    if (!el.offsetHeight) continue
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true })
    const h = (canvas.height / 2) * scale
    if (h <= room) { place(canvas, 0, canvas.height); continue }
    // taller than a page (a phase with many drills, a long grid of steps): cut between its parts
    const top = el.getBoundingClientRect().top
    const cuts = [...new Set((Array.from(el.querySelectorAll(':scope > *, :scope > * > *')) as HTMLElement[])
      .map((c) => Math.round((c.getBoundingClientRect().top - top) * 2)).filter((v) => v > 0 && v < canvas.height))].sort((a, b) => a - b)
    let from = 0
    while (from < canvas.height) {
      const left = (PH - M - y) / scale * 2
      const max = y > M ? left : room / scale * 2
      let to = canvas.height
      if (to - from > max) {
        const fit = cuts.filter((c) => c > from && c - from <= max)
        if (fit.length) to = fit[fit.length - 1]
        else if (y > M) { pdf.addPage(); y = M; continue }
        else to = from + max
      }
      place(canvas, from, to - from)
      from = to
    }
  }
  const blob = pdf.output('blob')
  const file = new File([blob], fileName, { type: 'application/pdf' })
  // inside the Telegram Mini App downloads do not work: the bot sends the file to the coach's chat
  if (inTelegram()) {
    const lang = getPrefs().lang
    const r = await sendPdfToChat(file, caption || '')
    const msg = tr(lang, r === null ? 'tgPdfSent' : r === 'blocked' ? 'tgPdfBlocked' : 'tgPdfFail')
    const app = tgApp()
    if (app) app.showAlert(msg); else alert(msg)
    return
  }
  // phones: offer the share sheet (save to files, Telegram…); otherwise download
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (mobile && nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: fileName }); return } catch (e) { if ((e as Error).name === 'AbortError') return }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = fileName
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

/** A file name from a title: letters, digits and dashes only. */
export const pdfName = (title: string) => (title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'pro-football') + '.pdf'
