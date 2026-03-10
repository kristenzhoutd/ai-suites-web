import { useState, useRef, type KeyboardEvent } from 'react';
import { Tag } from '@/design-system';

interface ChipInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function ChipInput({ value, onChange, placeholder = 'Add item...' }: ChipInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addChip = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeChip(value.length - 1);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2 p-2 border border-[var(--border-default,#e6e6e7)] rounded-lg bg-white min-h-[80px] items-start cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((chip, i) => (
        <Tag
          key={i}
          variant="neutral"
          style={{ fontSize: '12px' }}
          onClose={() => removeChip(i)}
        >
          {chip}
        </Tag>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addChip(inputValue); }}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] text-sm text-[var(--text-default,#020713)] placeholder-[var(--text-placeholder,#9a9ca1)] outline-none bg-transparent"
      />
    </div>
  );
}
