import React, { useEffect, useMemo, useState } from "react";
import styles from "./SaveMenu.module.css";
import { FaSave, FaUpload } from "react-icons/fa";
import useStore from "lib/store";
import useAutocomplete from "@mui/base/useAutocomplete";
import { api } from "lib/axios";

interface SaveMenuProps {
  setIsLoading: Function;
}

interface Mindmap {
  id: string;
  label: string;
}

const SaveMenu = ({ setIsLoading }: SaveMenuProps) => {
  const { isDirty, loadMap, nodes, edges, mindmapId, name } = useStore();

  const [id, setId] = useState("");
  const [inputId, setInputId] = useState("");
  const [userMaps, setUserMaps] = useState<Mindmap[]>([]);

  // const userMaps = [
  //   { label: "Scrum", id: "5d9af3d4-fdef-4285-af18-61404215ce98" },
  //   {
  //     label: "useEffect() behavior",
  //     id: "113377af-c858-4ab7-b30c-353f03d4a645",
  //   },
  //   { label: "Hello World", id: "fa345881-6251-465b-b7b8-c0c04e8feac2" },
  // ];

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "maps",
    options: userMaps,
    freeSolo: true,
    getOptionLabel: (option: any) => option.label,
    onChange: (event, value) => {
      handleInputChange(event, value);
      console.log("onchange");
    },
  });

  useEffect(() => {
    api.get("/api/listmaps").then((response) => {
      const mindmaps = response.data.map((mindmap: any) => {
        return { id: mindmap.id, label: mindmap.name };
      });
      setUserMaps(mindmaps);
    });
  }, []);

  const handleLoad = () => {
    loadMap(id);
  };

  function handleSave() {
    setIsLoading(true);

    const mindmapData = {
      mindmapId: mindmapId,
      name: name,
      nodes,
      edges,
    };

    console.log(mindmapData);

    api
      .post("/api/mindmap", JSON.stringify(mindmapData))
      .then((response) => {
        console.log("response.data.id", response.data.id);
        console.log(mindmapId);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }

  const handleInputChange = (e: any, value: any) => {
    console.log("value.id");
    console.log(value);
    console.log(value.id);
    setId(value.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.saveMenu}>
        <div {...getRootProps()}>
          <input
            className={styles.input}
            placeholder="Select Map"
            {...getInputProps()}
          />
        </div>
        {groupedOptions.length > 0 ? (
          <ul className={styles.optionsList} {...getListboxProps()}>
            {groupedOptions.map((option: any, index) => (
              <li key={index} {...getOptionProps({ option, index })}>
                {option.label}
              </li>
            ))}
          </ul>
        ) : null}
        <button onClick={handleLoad}>
          <FaUpload />
        </button>
        <button onClick={handleSave}>
          <FaSave />
        </button>
      </div>
    </div>
  );
};

export default SaveMenu;
