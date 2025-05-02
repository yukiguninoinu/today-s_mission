"use client";

import styles from "./FormButtons.module.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function FormButton({
  children,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      className={styles.button}
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
