"use client"
import useScrollEffect from "@/hooks/useScrollEffect";
import React from "react";

const scrolledClasses =
  "p-1 bg-background/50 sticky top-0 backdrop-blur border-b z-10";
const unscrolledClasses = "p-3 flex border-b";

const NavScrollWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrolled = useScrollEffect();
  return (
    <header className={`${scrolled ? scrolledClasses : unscrolledClasses}`}>
      {children}
    </header>
  );
};

export default NavScrollWrapper;
