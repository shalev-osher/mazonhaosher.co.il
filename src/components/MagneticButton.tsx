import { useRef, ReactNode, MouseEvent, CSSProperties } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
}

const MagneticButton = ({
  children,
  className = "",
  strength = 0.35,
  as = "button",
  href,
  onClick,
  ariaLabel,
  style,
  target,
  rel,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const commonProps = {
    ref: ref as React.Ref<HTMLElement>,
    className: `inline-block transition-transform duration-300 ease-out will-change-transform ${className}`,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    "aria-label": ariaLabel,
    style,
  };

  if (as === "a") {
    return (
      <a {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }
  if (as === "div") {
    return <div {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }
  return <button type="button" {...(commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
};

export default MagneticButton;
