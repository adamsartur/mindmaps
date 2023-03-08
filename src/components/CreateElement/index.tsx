import { useCallback, useState } from "react";
import useStore from "lib/store";
import { api } from "lib/axios";
import styles from "./CreateElement.module.css";
import SubmitButton from "./SubmitButton";
import Header from "./Header";
import { Colorpicker } from "./Colorpicker";
interface CreateElementProps {
  setIsLoading: Function;
}
const getNodeId = () => `randomnode_${+new Date()}`;

function CreateElement({ setIsLoading }: CreateElementProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputNodeName, setInputNodeName] = useState("Added node");
  const [color, setColor] = useState("#b1b1b7");
  const {
    nodes,
    edges,
    mindmapId,
    name,
    setMindmapId,
    setNodes,
    onNodesChange,
    generate,
  } = useStore(); // Retrieve nodes and edges from the store

  function handleGenerate(event: any) {
    generate(inputNodeName);
  }
  function handleOnSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    const mindmapData = {
      mindMapId: mindmapId,
      name: name,
      nodes,
      edges,
    };
    console.log(mindmapData);
    api
      .post("/api/mindmap", JSON.stringify(mindmapData)) // Send nodes and edges to API
      .then((response) => {
        setMindmapId(response.data.id);
        console.log("response.data.id", response.data.id);
        console.log(mindmapId);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }

  function handleColorChange(event: any) {
    setColor(event.target.value);
    console.log("color changed");
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

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: {
        label: inputNodeName,
        noLeftHandle: true,
        connectColor: color,
      },
      type: "menu",
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    console.log(nodes);
    setNodes([...nodes, newNode]);
  }, [setNodes, nodes, inputNodeName, color]);

  return (
    <div className={styles.CreateElement}>
      <Header
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mapName={name}
      />
      {isCollapsed ? null : (
        <div className={styles.collapsibleArea}>
          <div className={styles.menuContainer}>
            <textarea
              placeholder="Node text"
              className={styles.input}
              name="name"
              id="name"
              value={inputNodeName}
              onChange={(e) => {
                setInputNodeName(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={onAdd}>Create Node</button>
          </div>
          <div className={styles.menuContainer}>
            <Colorpicker
              color={color}
              handleColorChange={handleColorChange}
              handleColorClick={handleColorClick}
            />
          </div>
          <SubmitButton onClick={handleGenerate} text={"Generate"} />
          <SubmitButton onClick={handleOnSubmit} text={"Save Map"} />
        </div>
      )}
    </div>
  );
}

export default CreateElement;
