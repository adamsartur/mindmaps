import { FaTimes } from "react-icons/fa";
import styles from "./DeleteButton.module.css";

type DeleteButtonProps = {
  onClick: () => void;
};

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <button className={styles.deleteButton} onClick={onClick}>
      <FaTimes size={8} />
    </button>
  );
};

export default DeleteButton;
