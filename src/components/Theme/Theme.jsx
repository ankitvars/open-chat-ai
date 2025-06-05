import styles from "./Theme.module.css";

export function Theme() {
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
      <select defaultValue="light dark" onChange={handleValueChange}>
        <option value="light dark">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
