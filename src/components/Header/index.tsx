import { useState } from "react";
import styles from "./Header.module.css";
import { FaBrain, FaMagic, FaMinus, FaPlus } from "react-icons/fa";
import useStore from "../../lib/store";

interface HeaderProps {
  setIsCollapsed: Function;
  isCollapsed: boolean;
  mapName: string;
}

function Header({ setIsCollapsed, isCollapsed, mapName }: HeaderProps) {
  const { loadMap } = useStore();
  let isAIMenu = mapName == "AI" ? true : false;

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
      <div className={styles.full}>
        {!isAIMenu && mapName}
        {isAIMenu && (
          <span className={styles.span}>
            <FaBrain />
            <FaMagic />
          </span>
        )}
      </div>
      <span className={styles.icon}>
        {isCollapsed ? <FaPlus /> : <FaMinus />}
      </span>
    </a>
  );
}
export default Header;
