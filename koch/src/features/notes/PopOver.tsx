import React, { useEffect, useRef } from "react";

type Props = {
  position: {
    x: number;
    y: number;
  };
  children?: React.ReactNode;
  onClickOutside: () => void;
};

const PopOver: React.FC<Props> = ({ position, children, onClickOutside }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);
  return (
    <div
      ref={ref}
      className="flex rounded w-72 bg-neutral-900 z-10"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x
      }}
    >
      {children}
    </div>
  );
};

export default PopOver;
