import { MouseEventHandler } from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
  full?: boolean;
}

function SubmitButton({ onClick, text, full = false }: SubmitButtonProps) {
  let currentStyle = full ? styles.fullButton : styles.button;
  return (
    <button className={currentStyle} onClick={onClick}>
      {text}
    </button>
  );
}

export default SubmitButton;
