import React from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="min-h-screen bg-white text-gray-700 dark:text-gray-200 dark:bg-[#101a2b]">
        {children}
      </div>
    </div>
  );
}
