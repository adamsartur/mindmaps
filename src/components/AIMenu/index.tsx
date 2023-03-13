import { useCallback, useState } from "react";
import useStore from "lib/store";
import { api } from "lib/axios";
import styles from "./AIMenu.module.css";
import SubmitButton from "../Buttons/SubmitButton";
import Header from "../Header";

interface AIMenuProps {
  setIsLoading: Function;
}

const getNodeId = () => `randomnode_${+new Date()}`;

function AIMenu({ setIsLoading }: AIMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [inputNodeName, setInputNodeName] = useState("");

  const {
    nodes,
    edges,
    mindmapId,
    name,
    setMindmapId,
    setNodes,
    onNodesChange,
    generate,
    addCompletion,
  } = useStore();

  function handleGenerate(event: any) {
    setIsLoading(false);
    generate(inputNodeName);
  }

  function handleAddCompletion(event: any) {
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
      .post("/api/mindmap", JSON.stringify(mindmapData))
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

  return (
    <div className={styles.AIMenu}>
      <Header
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mapName={"AI"}
      />
      {isCollapsed ? null : (
        <div className={styles.collapsibleArea}>
          <div className={styles.menuContainer}>
            <textarea
              placeholder=""
              className={styles.input}
              name="name"
              id="name"
              value={inputNodeName}
              onChange={(e) => {
                setInputNodeName(e.target.value);
              }}
            />
          </div>
          <SubmitButton
            onClick={() => {
              addCompletion(inputNodeName);
            }}
            text={"Add to current"}
          />
          <SubmitButton onClick={handleGenerate} text={"Generate new"} />
        </div>
      )}
    </div>
  );
}

export default AIMenu;
