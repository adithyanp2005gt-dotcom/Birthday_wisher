import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useWish } from '../../context/useWish';
import './EditableText.css';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'blockquote' | 'div';
  ariaLabel?: string;
  disabled?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click to edit...',
  className = '',
  style,
  tag = 'span',
  ariaLabel,
  disabled = false,
}) => {
  const { isReadOnly } = useWish();
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setCurrentVal(value);
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Auto-resize textarea if multiline
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    }
  }, [isEditing, multiline]);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = currentVal.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setCurrentVal(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setCurrentVal(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentVal(e.target.value);
    if (multiline && e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const Tag = tag as keyof React.JSX.IntrinsicElements;

  // In generated links or when disabled, render completely static text with zero edit UI
  if (isReadOnly || disabled) {
    return (
      <Tag className={className} style={style} aria-label={ariaLabel}>
        {value || placeholder}
      </Tag>
    );
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentVal}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`inline-editable-input inline-editable-textarea ${className}`}
          style={style}
          rows={2}
          aria-label={ariaLabel || placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentVal}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`inline-editable-input ${className}`}
        style={style}
        aria-label={ariaLabel || placeholder}
      />
    );
  }

  return (
    <Tag
      className={`inline-editable-wrapper ${className}`}
      style={style}
      onClick={() => setIsEditing(true)}
      title="Click to edit this text directly"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
    >
      <span className="inline-editable-text">{value || placeholder}</span>
      <span className="inline-edit-indicator" aria-hidden="true">
        <Pencil size={11} />
      </span>
    </Tag>
  );
};
