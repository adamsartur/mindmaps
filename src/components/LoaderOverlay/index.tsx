import React from "react";
import styles from "./LoaderOverlay.module.css";

const LoaderOverlay = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoaderOverlay;
