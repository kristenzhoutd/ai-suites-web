import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  type ReactNode,
  type ReactElement,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** The trigger element */
  children: ReactElement;
  /** Tooltip content — string or rich content (TooltipText, TooltipBulletList, TooltipIconList) */
  content: ReactNode;
  /** Which side of the trigger to show the tooltip */
  side?: TooltipPosition;
  /** Delay in ms before showing (default 200) */
  delayMs?: number;
  /** Additional CSS class for the tooltip popup */
  className?: string;
}

export interface TooltipTextProps {
  children: string;
}

export interface TooltipBulletListProps {
  items: string[];
}

export interface TooltipIconListProps {
  items: string[];
}

export const TooltipText = ({ children }: TooltipTextProps) => (
  <p className="tooltip__text">{children}</p>
);

export const TooltipBulletList = ({ items }: TooltipBulletListProps) => (
  <ul className="tooltip__bullets">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const TooltipIconList = ({ items }: TooltipIconListProps) => (
  <div className="tooltip__icon-list">
    {items.map((item, i) => (
      <div key={i} className="tooltip__icon-row">
        <svg
          className="tooltip__check-icon"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M4 9L7.5 12.5L14 5.5"
            stroke="var(--success-6, #11B076)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="tooltip__text">{item}</span>
      </div>
    ))}
  </div>
);

const GAP = 8;

function computePosition(
  triggerRect: DOMRect,
  popupRect: DOMRect,
  side: TooltipPosition,
): CSSProperties {
  const { top, left, width, height } = triggerRect;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  switch (side) {
    case 'top':
      return {
        top: top + scrollY - popupRect.height - GAP,
        left: left + scrollX + width / 2 - popupRect.width / 2,
      };
    case 'bottom':
      return {
        top: top + scrollY + height + GAP,
        left: left + scrollX + width / 2 - popupRect.width / 2,
      };
    case 'left':
      return {
        top: top + scrollY + height / 2 - popupRect.height / 2,
        left: left + scrollX - popupRect.width - GAP,
      };
    case 'right':
      return {
        top: top + scrollY + height / 2 - popupRect.height / 2,
        left: left + scrollX + width + GAP,
      };
  }
}

const TooltipPopup = ({
  triggerRef,
  side,
  className,
  content,
}: {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  side: TooltipPosition;
  className: string;
  content: ReactNode;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const popup = popupRef.current;
    if (!trigger || !popup) return;

    const triggerRect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    setStyle(computePosition(triggerRect, popupRect, side));
  }, [triggerRef, side]);

  const popupClasses = ['tooltip__popup', `tooltip__popup--${side}`, className]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div ref={popupRef} className={popupClasses} role="tooltip" style={style}>
      <div className="tooltip__arrow" />
      <div className="tooltip__body">
        {typeof content === 'string' ? <TooltipText>{content}</TooltipText> : content}
      </div>
    </div>,
    document.body,
  );
};

export const Tooltip = ({
  children,
  content,
  side = 'top',
  delayMs = 200,
  className = '',
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  return (
    <div
      ref={triggerRef}
      className="tooltip"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <TooltipPopup
          triggerRef={triggerRef}
          side={side}
          className={className}
          content={content}
        />
      )}
    </div>
  );
};
