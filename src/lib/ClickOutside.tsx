import React, { FC, useState, useEffect, useCallback, useRef } from "react";

export interface ClickOutsideProps {
  onClickOutside: () => void;
  className?: string;
}

const ClickOutside: FC<ClickOutsideProps> = ({
  className,
  onClickOutside,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const insideRef = useRef(false);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Remember if initial press down is inside the element
    insideRef.current = !!ref.current?.contains(e.target as Node);
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    // If intial press down was outside the element, and the press up event
    // was also outside the element, then this press was a 'click outside'
    if (!insideRef.current && !ref.current?.contains(e.target as Node)) {
      onClickOutside();
    }
  }, []);

  useEffect(() => {
    // Apparently if we immediately attach event listener they may get fired
    // straight away in React 17
    setTimeout(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.addEventListener("pointerdown", handlePointerDown, false);
    document.addEventListener("pointerup", handlePointerUp, false);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, false);
      document.removeEventListener("pointerup", handlePointerUp, false);
    };
  }, [ready]);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default ClickOutside;
