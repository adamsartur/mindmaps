import useStore from "lib/store";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaEquals,
  FaGreaterThan,
  FaLessThan,
  FaNotEqual,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import styles from "./InputConditions.module.css";

interface Input {
  key: string;
  value: string;
  operation?: string;
}
interface InputConditionsProps {
  onInputsChange: Function;
  id: string;
}

function InputConditions({ onInputsChange, id }: InputConditionsProps) {
  const [inputs, setInputs] = useState<Input[]>([
    { key: "", value: "", operation: "" },
  ]);
  const [parentParams] = useStore((store) => store.getParentParams(id));

  const options = useMemo(() => {
    if (parentParams && parentParams.params) {
      return parentParams.params.map((param: any) => (
        <option key={param.key} value={param.key}>
          {param.key}
        </option>
      ));
    }
    return null;
  }, [parentParams]);
  // useEffect(() => {
  //   console.log(parentParams);
  //   if (parentParams && parentParams.params) {
  //     //setInputs(parentParams.params.map((param: any) => ({ key: param.key })));
  //   }
  //   console.log("setInputs");
  // }, []);

  function handleChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const values = [...inputs];
    const input = { ...values[index], [event.target.name]: event.target.value };
    values[index] = input;
    setInputs(values);
    onInputsChange(values);
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
          <select
            name="key"
            value={input.key}
            onChange={(event: any) => handleChange(index, event)}
            className={styles["input-field"]}
          >
            {options}
          </select>
          <span className={styles.idSpan}>
            <select name="operation" id="operation">
              <option title="equals" value="equals">
                ✅
              </option>
              <option value="not-equals" title="not-equals">
                ❌
              </option>
              <option value="greater-than" title="greater-than">
                🔼
              </option>
              <option value="less-than" title="less-than">
                🔽
              </option>
              <option value="includes" title="includes">
                🔍
              </option>
            </select>
          </span>
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

export default InputConditions;
