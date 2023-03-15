import { FaPlay } from "react-icons/fa";
import styles from "./PlayButton.module.css";

type PlayButtonProps = {
  onClick: () => void;
};

const PlayButton = ({ onClick }: PlayButtonProps) => {
  const handleClick = () => {
    // Get the parent element of the button
    // const parentElement = document.querySelector(
    //   `.${styles.PlayButton}`
    // )!.parentElement;

    // // Add the "valid" class to the parent element
    // parentElement!.classList.add("valid");

    // Call the onClick callback
    onClick();
  };
  return (
    <button className={styles.PlayButton} onClick={handleClick}>
      <FaPlay size={8} />
    </button>
  );
};

export default PlayButton;
