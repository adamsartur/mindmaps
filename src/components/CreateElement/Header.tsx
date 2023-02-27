import { useState } from "react";
import styles from "./Header.module.css";
import { FaMinus, FaPlus } from "react-icons/fa";

interface HeaderProps {
  setIsCollapsed: Function;
  isCollapsed: boolean;
  mapName: string;
}

function Header({ setIsCollapsed, isCollapsed, mapName }: HeaderProps) {
  function expandHandler() {
    setIsCollapsed(false);
    console.log("expandHandler");
  }

  function collapseHandler() {
    setIsCollapsed(true);
    console.log("collapseHandler");
  }

  return (
    <a
      className={styles.header}
      onClick={isCollapsed ? expandHandler : collapseHandler}
    >
      <div>{mapName}</div>
      <span className={styles.icon}>
        {isCollapsed ? <FaPlus /> : <FaMinus />}
      </span>
    </a>
  );
}
export default Header;
