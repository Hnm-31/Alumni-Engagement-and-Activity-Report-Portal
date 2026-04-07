import { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect — always opens downward, scrollable, styled.
 * Drop-in replacement for <select> with the same interface.
 *
 * Props:
 *   name, value, onChange, onBlur, placeholder, options, className
 *   options: string[] OR { label, value }[]
 */
export default function CustomSelect({
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Select…',
  options = [],
  className = '',
  disabled = false,
}) {
  const [open, setOpen]       = useState(false);
  const containerRef          = useRef(null);
  const listRef               = useRef(null);

  // Normalise options to { label, value }
  const normalised = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  );

  const selected = normalised.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        onBlur?.({ target: { name } });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [name, onBlur]);

  // Close on Escape; scroll selected item into view when opening
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);

    // Scroll the selected option into view
    if (listRef.current && value) {
      const el = listRef.current.querySelector('[data-selected="true"]');
      el?.scrollIntoView({ block: 'nearest' });
    }
    return () => document.removeEventListener('keydown', handler);
  }, [open, value]);

  const handleSelect = (optValue) => {
    onChange?.({ target: { name, value: optValue } });
    setOpen(false);
    onBlur?.({ target: { name } });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 text-sm rounded-xl border
          bg-white transition-all duration-150 text-left
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-blue-300'}
          ${open ? 'border-blue-400 ring-2 ring-blue-400' : 'border-gray-200'}
          ${value ? 'text-gray-800' : 'text-gray-400'}
        `}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel — always below, never above */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-50
                     bg-white border border-gray-200 rounded-xl shadow-xl
                     overflow-hidden"
          style={{ maxHeight: '220px' }}
        >
          {/* Search hint for long lists */}
          <div
            ref={listRef}
            className="overflow-y-auto"
            style={{ maxHeight: '220px' }}
          >
            {normalised.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">No options</p>
            ) : (
              normalised.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                      flex items-center gap-2
                      ${isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span className={isSelected ? '' : 'ml-5'}>{opt.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
