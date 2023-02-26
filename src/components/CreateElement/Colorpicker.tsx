import { ChangeEventHandler, MouseEventHandler } from "react";
import styles from "./Colorpicker.module.css";

interface ColorpickerProps {
  color: string;
  handleColorClick: MouseEventHandler<HTMLDivElement>;
  handleColorChange: ChangeEventHandler<HTMLInputElement>;
}

export function Colorpicker({
  color,
  handleColorChange,
  handleColorClick,
}: ColorpickerProps) {
  return (
    <div className={styles.colorPicker}>
      <label className={styles.label} htmlFor="color">
        Color
      </label>
      <div className={styles.colorPickerContainer}>
        {color}
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: color }}
          onClick={handleColorClick}
        />
        <input
          className={styles.colorInput}
          type="color"
          value={color}
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
}
