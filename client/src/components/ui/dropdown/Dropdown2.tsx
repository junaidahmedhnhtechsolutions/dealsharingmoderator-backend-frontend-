import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef: React.RefObject<HTMLElement> | any;
  position?: "left" | "right"; // <- New prop
}

export const Dropdown2: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  triggerRef,
  position = "left", // default
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 200; // Approx or fixed
      const padding = 8;

      let calculatedLeft = triggerRect.left;

      // Preferred position logic
      if (position === "right") {
        calculatedLeft = triggerRect.right - dropdownWidth;
      }

      // Viewport overflow handling
      const spaceRight = window.innerWidth - triggerRect.left;
      const spaceLeft = triggerRect.right;

      if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
        calculatedLeft = triggerRect.right - dropdownWidth;
      } else if (spaceLeft < dropdownWidth && spaceRight > dropdownWidth) {
        calculatedLeft = triggerRect.left;
      }

      setStyles({
        position: "absolute",
        top: triggerRect.bottom + window.scrollY + padding,
        left: calculatedLeft + window.scrollX,
        zIndex: 9999,
        minWidth: dropdownWidth,
      });
    }
  }, [isOpen, triggerRef, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={styles}
      className={`rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
