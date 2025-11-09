export default function Checkbox({
  value,
  onChange,
  disabled,
  onBlur,
  selectRef,
  label,
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
      onClick={() => (!disabled ? onChange(!value) : undefined)}
      ref={selectRef}
      onBlur={onBlur}
    >
      <div
        className={`w-5 h-5 border rounded flex items-center justify-center transition-colors
          ${
            value
              ? 'bg-linear-to-tr from-primary to-primary-light border-none'
              : 'bg-white border-slate-300'
          }
          ${disabled ? 'opacity-50' : ''}`}
      >
        {value && (
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="4 11 8 15 16 6" />
          </svg>
        )}
      </div>
      {label && (
        <span className={`${disabled ? 'opacity-50' : ''}`}>{label}</span>
      )}
    </div>
  )
}
