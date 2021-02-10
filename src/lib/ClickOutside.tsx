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
  const handleClick = useCallback((e: MouseEvent) => {
    if (ref.current?.contains(e.target as Node)) return;
    onClickOutside();
  }, []);

  useEffect(() => {
    // Apparently if we immediately attach event listener they may get fired
    // straight away in React 17
    setTimeout(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.addEventListener("click", handleClick, false);
    return () => document.removeEventListener("click", handleClick, false);
  }, [ready]);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default ClickOutside;
