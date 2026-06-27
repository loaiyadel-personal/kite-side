import { NextResponse } from 'next/server'

export interface TideEntry {
  type:   'high' | 'low'
  time:   string  // "07:13"
  height: number  // 1.6
}

export interface TidesResponse {
  entries: TideEntry[]
  high:    TideEntry | null  // peak high of the day
  low:     TideEntry | null  // lowest low of the day
}

export async function GET() {
  try {
    const res = await fetch('https://wisuki.com/tide/36/ras-sudr', {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KiteSide/1.0)' },
    })
    if (!res.ok) throw new Error(`Wisuki ${res.status}`)
    const html = await res.text()

    // Today in YYYY-MM-DD matching the Wisuki link format
    const today = new Date().toLocaleDateString('en-CA')

    // Split on all date links and find today's chunk
    const parts = html.split('action=plot&day=')
    const todayPart = parts.find(p => p.startsWith(today))
    if (!todayPart) {
      return NextResponse.json({ error: 'No data for today' }, { status: 404 })
    }

    // Take up to 800 chars — enough for 4 tide entries, stops before the next date
    const rowChunk = todayPart.slice(0, 800)

    // Each entry: color:red (▼ low) or color:green (▲ high), then time, then height
    const tideRe = /color:(red|green)[^>]*>&#x25B[C2];?<\/span>\s*<strong>(\d{2}:\d{2})<\/strong>\s*<span>([\d.]+)m<\/span>/g
    const entries: TideEntry[] = []
    let m: RegExpExecArray | null
    while ((m = tideRe.exec(rowChunk)) !== null) {
      entries.push({
        type:   m[1] === 'green' ? 'high' : 'low',
        time:   m[2],
        height: parseFloat(m[3]),
      })
    }

    if (!entries.length) {
      return NextResponse.json({ error: 'Parse failed' }, { status: 404 })
    }

    const highs = entries.filter(e => e.type === 'high').sort((a, b) => b.height - a.height)
    const lows  = entries.filter(e => e.type === 'low' ).sort((a, b) => a.height - b.height)

    const data: TidesResponse = {
      entries,
      high: highs[0] ?? null,
      low:  lows[0]  ?? null,
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
