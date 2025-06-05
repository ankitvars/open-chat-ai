import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.LoaderWrapper}>
      <div className={styles.Loader} />
    </div>
  );
};
