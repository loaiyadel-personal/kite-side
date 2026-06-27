'use client'

import Modal from './Modal'

interface ConfirmDialogProps {
  open:        boolean
  onClose:     () => void
  onConfirm:   () => void
  title:       string
  message:     string
  confirmLabel?: string
  danger?:     boolean
  loading?:    boolean
}

export default function ConfirmDialog({
  open, onClose, onConfirm,
  title, message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-white/60 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} disabled={loading}
          className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
            danger
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-brand-primary hover:bg-[#158bbf] text-white'
          }`}>
          {loading ? 'Loading…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
