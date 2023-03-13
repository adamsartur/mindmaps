import { useCallback, useState } from "react";
import useStore from "lib/store";
import { api } from "lib/axios";
import styles from "./CreateElement.module.css";
import SubmitButton from "../Buttons/SubmitButton";
import Header from "../Header";
import InputParams from "components/InputParams";

interface CreateElementProps {
  setIsLoading: Function;
}

interface Input {
  key: string;
  value: string;
}

const getNodeId = () => `randomnode_${+new Date()}`;

function CreateElement({ setIsLoading }: CreateElementProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputNodeName, setInputNodeName] = useState("");
  const [inputs, setInputs] = useState<Input[]>([{ key: "", value: "" }]);
  const { nodes, setNodes, mindmapId, name, setMindmapId } = useStore();

  const handleInputsChange = useCallback((newInputs: any) => {
    setInputs(newInputs);
  }, []);

  const handleOnSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const mindmapData = {
      mindMapId: mindmapId,
      name: name,
      nodes,
    };
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
  };

  const onAdd = useCallback(() => {
    const params = inputs ? inputs : [];
    const newNode = {
      id: getNodeId(),
      data: {
        label: inputNodeName,
        noLeftHandle: true,
        params,
      },
      type: "menu",
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    };
    console.log(newNode);
    setNodes([...nodes, newNode]);
  }, [setNodes, nodes, inputNodeName, inputs]);

  return (
    <div className={styles.CreateElement}>
      <Header
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mapName={"Add"}
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
              onChange={(e) => setInputNodeName(e.target.value)}
            />
          </div>
          <div className={styles.inputParamsContainer}>
            <InputParams onInputsChange={handleInputsChange} />
          </div>
          <SubmitButton onClick={onAdd} text={"Create Node"} />
        </div>
      )}
    </div>
  );
}

export default CreateElement;
