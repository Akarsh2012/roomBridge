"use client";

import styles from "./Loader.module.css";

interface LoaderProps {
  initial?: boolean;
}

export default function Loader(props: LoaderProps) {
  const initial = props.initial ?? false;
  return (
    <div className={`${styles.overlay} ${initial ? styles.overlayInitial : ""}`}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <svg
            className={styles.logo}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className={styles.brand}>RoomBridge</h1>
        <div className={styles.spinnerTrack}>
          <div className={styles.spinnerBar} />
        </div>
      </div>
    </div>
  );
}
