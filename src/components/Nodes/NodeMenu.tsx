import useStore from "lib/store";
import { KeyboardEvent, memo, useState } from "react";
import { Handle, Position, useNodeId, NodeProps } from "reactflow";
import styles from "./NodeMenu.module.css";
import DeleteButton from "../Buttons/DeleteButton";
import AddButton from "../Buttons/AddButton";
import AddSibling from "../Buttons/AddSibling";
import PlayButton from "../Buttons/PlayButton";

const NodeMenu = ({
  id,
  data,
  xPos,
  yPos,
  selected,
}: NodeProps & {
  noLeftHandle?: boolean;
  connectColor?: string;
}) => {
  //const onNodeDelete = useStore((state) => state.nodeDelete());
  const deleteNode = useStore((state) => state.deleteNode);
  const addEdge = useStore((state) => state.addEdge);
  const addNode = useStore((state) => state.addNode);
  const updateNode = useStore((state) => state.updateNode);
  const setNodeParams = useStore((state) => state.setNodeParams);

  const [label, setLabel] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);

  const { noLeftHandle, connectColor } = data;

  function handleDelete() {
    deleteNode(id);
  }
  function handleAddSibling() {
    console.log("Add Sibling button clicked");

    const nodeWidth = 200;
    const nodeHeight = 50;

    const { nodes, edges } = useStore.getState();

    const sourceNode = nodes.find((n) => n.id === id);
    const parentEdge = edges.find((e) => e.target === sourceNode?.id);
    const parentNode = parentEdge
      ? nodes.find((n) => n.id === parentEdge.source)
      : null;

    if (!parentNode) {
      console.log("No parent node found");
      return;
    }

    const targetNodeData = nodes.find((n) => n.id === parentNode.id)?.data;

    let x = xPos || 0;
    let y = yPos + 30 || 0;

    // check for existing nodes in the same position
    nodes
      .filter((n) => n.id !== id)
      .forEach((n) => {
        if (
          n.position.x > x - nodeWidth &&
          n.position.x < x + nodeWidth &&
          n.position.y > y - nodeHeight &&
          n.position.y < y + nodeHeight
        ) {
          // if there is an existing node, move y position down by 30 until an empty space is found
          y += 30;
        }
      });

    const newNodeId = Date.now().toString();

    // add new node
    const newNode = {
      id: newNodeId,
      data: { label: "New Sibling", ...targetNodeData },
      type: "menu",
      position: {
        x,
        y,
      },
    };
    addNode(newNode);

    // add new edge
    const newEdge = {
      id: `${parentNode.id}-${newNodeId}`,
      source: parentNode.id,
      target: newNodeId,
    };
    addEdge(newEdge);
  }

  function handleEdit() {
    console.log("Edit button clicked");
  }
  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    handleNewConnection: () => void,
    handleNewSibling: () => void
  ) {
    if (event.key === "Tab") {
      event.preventDefault();
      handleNewConnection();
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleNewSibling();
    }
  }

  function handleExpand() {
    console.log("Expand button clicked");
  }

  function handleCopy() {
    console.log("Copy button clicked");
  }
  function handleLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLabel(event.target.value);
    updateNode(id, { ...data, label: event.target.value });
  }

  function handlePlay() {
    console.log("Play button clicked");
    setNodeParams(id);
  }

  function handleNewConnection() {
    console.log("New Connection button clicked");

    const nodeWidth = 200;
    const nodeHeight = 50;
    const nodes = useStore.getState().nodes;

    const sourceNode = nodes.find((n) => n.id === id);

    let x = xPos + 300 || 0;
    let y = yPos - 50 || 0;

    // check for existing nodes in the same position
    nodes
      .filter((n) => n.id !== id)
      .forEach((n) => {
        if (
          n.position.x > x - nodeWidth &&
          n.position.x < x + nodeWidth &&
          n.position.y > y - nodeHeight &&
          n.position.y < y + nodeHeight
        ) {
          // if there is an existing node, move y position down by 30 until an empty space is found
          y += 30;
        }
      });

    const newNodeId = Date.now().toString();
    const targetNodeId = newNodeId;

    // add new node
    const newNode = {
      id: newNodeId,
      data: { label: "New Node" },
      type: "menu",
      position: {
        x,
        y,
      },
    };
    addNode(newNode);

    // add new edge
    const newEdge = {
      id: `${sourceNode!.id}-${targetNodeId}`,
      source: sourceNode!.id,
      type: "custom",
      target: targetNodeId,
      data: { label: "New Edge" },
    };
    addEdge(newEdge);
  }

  return (
    <>
      <div
        className={styles.node}
        style={{ padding: "10px 20px", cursor: "text" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {selected && <DeleteButton onClick={handleDelete} />}
        {selected && <AddButton onClick={handleNewConnection} />}
        {selected && <AddSibling onClick={handleAddSibling} />}
        {selected && <PlayButton onClick={handlePlay} />}
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          autoFocus
          className={styles.node_input}
          onKeyDown={(event) =>
            handleKeyDown(event, handleNewConnection, handleAddSibling)
          }
        />

        {data.params && data.params.length > 0 && (
          <div className={styles.nodeParams}>
            {data.params.map((param: any, index: any) => (
              <div key={index} className={styles.node_param}>
                <span>{param.key}</span>
                <span>{param.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {!noLeftHandle && <Handle type="target" position={Position.Left} />}
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(NodeMenu);
