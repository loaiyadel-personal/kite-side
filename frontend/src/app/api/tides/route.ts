import { NextResponse } from 'next/server'

export interface TideEntry {
  type: 'high' | 'low'
  time: string   // "07:13"
  height: number // 1.6
}

export interface TidesResponse {
  high: TideEntry | null
  low: TideEntry | null
  all: TideEntry[]
}

export async function GET() {
  try {
    const res = await fetch('https://wisuki.com/tide/36/ras-sudr', {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KiteSide/1.0)' },
    })
    if (!res.ok) throw new Error(`Wisuki returned ${res.status}`)
    const html = await res.text()

    // Today in YYYY-MM-DD, matching the format in the page links
    const today = new Date().toLocaleDateString('en-CA') // "2026-06-11"

    // Capture the block of HTML for today's row only
    const rowRegex = new RegExp(
      `action=plot&day=${today}[\\s\\S]{0,200}?(<td[\\s\\S]{0,1200}?)(?=action=plot&day=|</tbody>)`
    )
    const rowMatch = html.match(rowRegex)
    if (!rowMatch) {
      return NextResponse.json({ error: 'No tide data for today' }, { status: 404 })
    }

    // Each tide entry: color:red (▼ low) or color:green (▲ high), then time, then height
    // &#x25BC = ▼ (no semicolon in source), &#x25B2; = ▲ (with semicolon)
    const tideRegex = /color:(red|green)[^>]*>&#x25B[C2];?<\/span>\s*<strong>(\d{2}:\d{2})<\/strong>\s*<span>([\d.]+)m<\/span>/g
    const entries: TideEntry[] = []
    let m: RegExpExecArray | null
    while ((m = tideRegex.exec(rowMatch[1])) !== null) {
      entries.push({
        type:   m[1] === 'green' ? 'high' : 'low',
        time:   m[2],
        height: parseFloat(m[3]),
      })
    }

    if (!entries.length) {
      return NextResponse.json({ error: 'Could not parse tide data' }, { status: 404 })
    }

    const highs = entries.filter(e => e.type === 'high').sort((a, b) => b.height - a.height)
    const lows  = entries.filter(e => e.type === 'low' ).sort((a, b) => a.height - b.height)

    const data: TidesResponse = {
      high: highs[0] ?? null,
      low:  lows[0]  ?? null,
      all:  entries,
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tide data' }, { status: 500 })
  }
}
