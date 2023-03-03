import React, { useState } from "react";
import styles from "./LockButton.module.css";
import { FaLock, FaLockOpen } from "react-icons/fa";

interface Props {
  locked: boolean;
  onChange: (locked: boolean) => void;
}

const LockButton = ({ locked, onChange }: Props) => {
  const [isLocked, setIsLocked] = useState<boolean>(locked);

  const handleClick = () => {
    setIsLocked(!isLocked);
    onChange(!isLocked);
    console.log("clicked");
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      {isLocked && <FaLock />}
      {!isLocked && <FaLockOpen />}
    </div>
  );
};

export default LockButton;
