import { FaPlus } from "react-icons/fa";
import styles from "./AddSibling.module.css";

type AddSiblingProps = {
  onClick: () => void;
};

const AddSibling = ({ onClick }: AddSiblingProps) => {
  return (
    <button className={styles.addSibling} onClick={onClick}>
      <FaPlus size={8} />
    </button>
  );
};

export default AddSibling;
