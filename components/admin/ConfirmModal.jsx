'use client'

import { AlertTriangle, AlertCircle, Radio, Square, X, Loader2 } from 'lucide-react'

export default function ConfirmModal({
  isOpen,
  mode = 'confirm', // 'confirm' | 'alert'
  variant = 'default', // 'default' | 'danger' | 'warning'
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  const icon =
    variant === 'danger' ? (
      <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
        {mode === 'alert' ? <AlertCircle size={20} /> : <Radio size={20} />}
      </div>
    ) : variant === 'warning' ? (
      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
        <AlertTriangle size={20} />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-full bg-zinc-500/10 text-zinc-400 flex items-center justify-center shrink-0">
        <Square size={18} />
      </div>
    )

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-accent hover:opacity-90 text-white'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => {
        if (!loading && onCancel) onCancel()
      }}
    >
      <div
        className="w-full max-w-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon}
            <h3 className="font-display font-semibold text-base leading-snug">{title}</h3>
          </div>
          {onCancel && (
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="p-1.5 rounded-md hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="px-5 pb-5">
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark whitespace-pre-line leading-relaxed">
            {message}
          </p>

          <div className="mt-5 flex items-center justify-end gap-2">
            {mode === 'confirm' && onCancel && (
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="px-3.5 py-2 rounded-sm border border-border-light dark:border-border-dark hover:bg-bg-light dark:hover:bg-bg-dark text-xs font-medium transition-colors disabled:opacity-60"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`px-4 py-2 rounded-sm text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60 ${confirmBtnClass}`}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
