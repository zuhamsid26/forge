function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
      >
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal