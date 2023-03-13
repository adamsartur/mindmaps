import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./InputParams.module.css";

interface Input {
  key: string;
  value: string;
}
interface InputParamsProps {
  onInputsChange: Function;
}

function InputParams({ onInputsChange }: InputParamsProps) {
  const [inputs, setInputs] = useState<Input[]>([{ key: "", value: "" }]);

  function handleChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const values = [...inputs];
    const input = { ...values[index], [event.target.name]: event.target.value };
    values[index] = input;
    setInputs(values);
    onInputsChange(values);
    console.log(values);
  }

  function handleAdd() {
    const values = [...inputs];
    values.push({ key: "", value: "" });
    setInputs(values);
  }

  function handleRemove(index: number) {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
  }

  return (
    <div className={styles.container}>
      {inputs.map((input, index) => (
        <div key={index} className={styles["input-row"]}>
          <input
            type="text"
            name="key"
            value={input.key}
            onChange={(event) => handleChange(index, event)}
            placeholder="Key"
            className={styles["input-field"]}
          />
          <input
            type="text"
            name="value"
            value={input.value}
            onChange={(event) => handleChange(index, event)}
            placeholder="Value"
            className={styles["input-field"]}
          />
          {inputs.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className={styles["remove-button"]}
            >
              &#x2716;
            </button>
          )}
        </div>
      ))}
      {inputs.length < 10 && (
        <button
          type="button"
          onClick={handleAdd}
          className={styles["add-button"]}
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
}

export default InputParams;
