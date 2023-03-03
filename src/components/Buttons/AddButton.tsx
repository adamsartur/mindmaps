import { FaPlus } from "react-icons/fa";
import styles from "./AddButton.module.css";

type AddButtonProps = {
  onClick: () => void;
};

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button className={styles.addButton} onClick={onClick}>
      <FaPlus size={8} />
    </button>
  );
};

export default AddButton;
