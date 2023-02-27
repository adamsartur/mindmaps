import { MouseEventHandler } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      Save Map
    </button>
  );
}

export default SubmitButton;
