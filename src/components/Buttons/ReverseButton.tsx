import { FaArrowsAlt, FaPlus } from "react-icons/fa";
import styles from "./ReverseButton.module.css";

type ReverseButtonProps = {
  onClick: () => void;
};

const ReverseButton = ({ onClick }: ReverseButtonProps) => {
  return (
    <button className={styles.ReverseButton} onClick={onClick}>
      <FaArrowsAlt size={8} />
    </button>
  );
};

export default ReverseButton;
