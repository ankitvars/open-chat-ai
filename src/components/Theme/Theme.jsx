import styles from "./Theme.module.css";
import { useEffect, useRef } from "react";

export function Theme() {
  const selectRef = useRef();

  useEffect(() => {
    // Detect system theme on mount
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      selectRef.current.value = "dark";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add("dark");
    } else {
      selectRef.current.value = "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  function handleValueChange(event) {
    const theme = event.target.value;
    document.documentElement.classList.remove("light", "dark");

    if (theme === "light" || theme === "dark") {
      document.documentElement.classList.add(theme);
    }

    // Optional: Update meta tag for completeness
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute("content", theme);
    }
  }

  return (
    <div className={styles.Theme}>
      <span>Theme:</span>
      <select
        ref={selectRef}
        defaultValue="system"
        onChange={handleValueChange}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
