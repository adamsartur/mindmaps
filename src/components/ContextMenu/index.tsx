import React from "react";
import styles from "./ContextMenu.module.css";

type ContextMenuProps = {
  posX: number;
  posY: number;
  menuOptions: { label: string; onClick: () => void }[];
};

const ContextMenu = ({ posX, posY, menuOptions }: ContextMenuProps) => {
  return (
    <div className={styles.menu} style={{ top: posY, left: posX }}>
      {menuOptions.map((option, index) => (
        <div key={index} className={styles.option} onClick={option.onClick}>
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
