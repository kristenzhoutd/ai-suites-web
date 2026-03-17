import { useId, type TextareaHTMLAttributes } from 'react';
import { CircleHelpIcon, WarningIcon } from '../../icons/Icons';
import './InputField.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  status?: 'default' | 'error' | 'warning';
  required?: boolean;
  showHelpIcon?: boolean;
}

export const TextArea = ({
  label,
  helpText,
  errorMessage,
  status = 'default',
  required = false,
  showHelpIcon = false,
  className = '',
  id: externalId,
  ...props
}: TextAreaProps) => {
  const autoId = useId();
  const id = externalId || autoId;
  const descriptionId = helpText ? `${id}-description` : undefined;
  const errorId = errorMessage && status === 'error' ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const fieldClasses = ['field', status !== 'default' ? `field--${status}` : '', className]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    'input',
    'input--textarea',
    status !== 'default' ? `input--${status}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const textareaElement = (
    <textarea
      id={id}
      className={inputClasses}
      required={required}
      aria-invalid={status === 'error' || undefined}
      aria-describedby={describedBy}
      {...props}
    />
  );

  const displayMessage = status === 'error' && errorMessage ? errorMessage : helpText;

  return (
    <div className={fieldClasses}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span className="field__label-required">*</span>}
          {showHelpIcon && (
            <span className="field__label-help">
              <CircleHelpIcon width={14} height={14} />
            </span>
          )}
        </label>
      )}
      {status === 'warning' ? (
        <div className="field__input-wrapper">
          {textareaElement}
          <WarningIcon className="field__warning-icon" />
        </div>
      ) : (
        textareaElement
      )}
      {displayMessage && (
        <span
          className="field__help-text"
          id={errorId || descriptionId}
          role={status === 'error' ? 'alert' : undefined}
        >
          {displayMessage}
        </span>
      )}
    </div>
  );
};
