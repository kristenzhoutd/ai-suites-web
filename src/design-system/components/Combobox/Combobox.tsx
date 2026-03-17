import { useState, useRef, useEffect, useCallback } from 'react';
import { CaretDownIcon, CheckIcon } from '../../icons/Icons';
import './Combobox.css';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  label?: string;
  helpText?: string;
  status?: 'default' | 'error' | 'warning';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  label,
  helpText,
  status = 'default',
  disabled = false,
  readOnly = false,
  required = false,
  id,
  className = '',
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const openDropdown = useCallback(() => {
    if (disabled || readOnly) return;
    setOpen(true);
    setSearch('');
    setHighlightedIndex(-1);
  }, [disabled, readOnly]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback(
    (optionValue: string) => {
      onChange?.(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, closeDropdown]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-combobox-item]');
    items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          selectOption(filtered[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  };

  const triggerClasses = [
    'combobox__trigger',
    !selectedOption && 'combobox__trigger--placeholder',
    disabled && 'combobox__trigger--disabled',
    readOnly && 'combobox__trigger--readonly',
    status !== 'default' && `combobox__trigger--${status}`,
    open && 'combobox__trigger--open',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClasses = ['field', status !== 'default' ? `field--${status}` : '', className]
    .filter(Boolean)
    .join(' ');

  const triggerElement = (
    <div className="combobox" ref={comboboxRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={triggerClasses}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        id={id}
      >
        <span className="combobox__trigger-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {!readOnly && <CaretDownIcon className="combobox__trigger-icon" />}
      </button>

      {open && (
        <div className="combobox__content" role="listbox">
          <div className="combobox__search">
            <input
              ref={searchRef}
              type="text"
              className="combobox__search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
            />
          </div>
          <div className="combobox__list" ref={listRef}>
            {filtered.length === 0 ? (
              <div className="combobox__empty">{emptyText}</div>
            ) : (
              filtered.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  data-combobox-item
                  className={[
                    'combobox__item',
                    option.value === value && 'combobox__item--selected',
                    index === highlightedIndex && 'combobox__item--highlighted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectOption(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <CheckIcon
                    className={`combobox__item-check ${option.value !== value ? 'combobox__item-check--hidden' : ''}`}
                  />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={fieldClasses}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span className="field__label-required">*</span>}
        </label>
      )}
      {triggerElement}
      {helpText && <span className="field__help-text">{helpText}</span>}
    </div>
  );
};
