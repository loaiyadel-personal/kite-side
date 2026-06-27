'use client'

import { useRef, useState } from 'react'

interface Props {
  value?:       string
  onChange:     (file: File) => void
  onClear?:     () => void
  label?:       string
  aspectRatio?: string
}

const MAX_MB = 10
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export default function ImageUpload({ value, onChange, onClear, label = 'Image', aspectRatio = '16/9' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFile(file: File) {
    setError(null)
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB}MB`); setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange(file)
  }

  const display = preview ?? value

  return (
    <div>
      {label && <label className="block text-sm text-white/60 mb-1.5">{label}</label>}
      <div
        className="relative rounded-xl border-2 border-dashed border-white/15 hover:border-brand-primary/50 transition-colors cursor-pointer overflow-hidden bg-white/5"
        style={{ aspectRatio }}
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onDragOver={e => e.preventDefault()}>
        {display ? (
          <>
            <img src={display} alt="preview" className="w-full h-full object-cover" />
            {(onClear || preview) && (
              <button type="button"
                onClick={e => { e.stopPropagation(); setPreview(null); onClear?.(); inputRef.current && (inputRef.current.value = '') }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center text-sm transition-colors">
                ×
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mb-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-xs">Click or drag to upload</p>
            <p className="text-xs opacity-60 mt-0.5">Max {MAX_MB}MB · JPEG, PNG, WebP</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}
