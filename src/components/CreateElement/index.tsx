import { useState } from "react";
import styles from "./CreateElement.module.css";
import SubmitButton from "./SubmitButton";
import Header from "./Header";
import { Colorpicker } from "./Colorpicker";

function CreateElement() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [mapName, setMapName] = useState("MyMap");

  function handleOnSubmit(event: any) {
    console.log("clicked");
  }

  function handleColorChange(event: any) {
    setColor(event.target.value);
    const colorPicker = document.getElementById("color-picker");
    if (colorPicker) {
      colorPicker.remove();
    }
  }

  function handleColorClick() {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = color;
    colorPicker.oninput = handleColorChange;
    colorPicker.click();
  }

  function handleInput() {}
  return (
    <div className={styles.CreateElement}>
      <Header
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mapName={mapName}
      />
      {isCollapsed ? null : (
        <div className={styles.collapsibleArea}>
          <div className={styles.menuContainer}>
            <input
              placeholder="Node text"
              className={styles.input}
              type="text"
              name="name"
              id="name"
            />
          </div>
          <div className={styles.menuContainer}>
            <Colorpicker
              color={color}
              handleColorChange={handleColorChange}
              handleColorClick={handleColorClick}
            />
          </div>
          <SubmitButton onClick={handleOnSubmit} />
        </div>
      )}
    </div>
  );
}

export default CreateElement;
