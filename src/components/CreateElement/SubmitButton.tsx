import { MouseEventHandler } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

function SubmitButton({ onClick, text }: SubmitButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}

export default SubmitButton;
