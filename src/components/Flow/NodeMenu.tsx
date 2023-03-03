import useStore from "lib/store";
import { KeyboardEvent, memo, useEffect, useState } from "react";
import { Handle, Position, NodeToolbar, useNodeId, NodeProps } from "reactflow";
import styles from "./NodeMenu.module.css";
import DeleteButton from "../Buttons/DeleteButton";
import AddButton from "../Buttons/AddButton";
import AddSibling from "../Buttons/AddSibling";

const NodeMenu = ({ id, data, xPos, yPos, selected }: NodeProps) => {
  //const onNodeDelete = useStore((state) => state.nodeDelete());
  const deleteNode = useStore((state) => state.deleteNode);
  const addEdge = useStore((state) => state.addEdge);
  const addNode = useStore((state) => state.addNode);
  const updateNode = useStore((state) => state.updateNode);

  const [label, setLabel] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);

  const { noLeftHandle, connectColor } = data;
  const nodeId = useNodeId();

  function handleDelete() {
    console.log("Delete button clicked ", nodeId);
    deleteNode(id);
  }
  function handleAddSibling() {
    console.log("Add Sibling button clicked");

    const nodeWidth = 200;
    const nodeHeight = 50;

    const nodes = useStore.getState().nodes;
    const edges = useStore.getState().edges;

    const sourceNode = nodes.find((n) => n.id === id);
    const parentEdge = edges.find((e) => e.target === sourceNode?.id);
    const parentNode = parentEdge
      ? nodes.find((n) => n.id === parentEdge.source)
      : null;

    if (!parentNode) {
      console.log("No parent node found");
      return;
    }

    const targetNodeData = useStore
      .getState()
      .nodes.find((n) => n.id === parentNode.id)?.data;

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

  function handleNewConnection() {
    console.log("New Connection button clicked");

    const nodeWidth = 200;
    const nodeHeight = 50;

    const sourceNode = useStore.getState().nodes.find((n) => n.id === id);

    let x = xPos + 300 || 0;
    let y = yPos - 50 || 0;

    // check for existing nodes in the same position
    useStore
      .getState()
      .nodes.filter((n) => n.id !== id)
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
      target: targetNodeId,
    };
    addEdge(newEdge);
  }

  return (
    <>
      {/* <NodeToolbar
        isVisible={data.toolbarVisible}
        position={data.toolbarPosition}
        className={styles.toolbar}
      >
        <button className={styles.edit} onClick={handleEdit}>
          Edit
        </button>
        <button className={styles.expand} onClick={handleExpand}>
          Expand
        </button>
        <button className={styles.copy} onClick={handleCopy}>
          Copy
        </button>
        <button className={styles.new} onClick={handleNewConnection}>
          New Connection
        </button>
      </NodeToolbar> */}
      <div
        className={styles.node}
        style={{ padding: "10px 20px", cursor: "text" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {selected && <DeleteButton onClick={handleDelete} />}
        {selected && <AddButton onClick={handleNewConnection} />}
        {selected && <AddSibling onClick={handleAddSibling} />}
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          autoFocus
          style={{ width: "100%" }}
          className={styles.node_input}
          onKeyDown={(event) =>
            handleKeyDown(event, handleNewConnection, handleAddSibling)
          }
        />
      </div>
      {!noLeftHandle && <Handle type="target" position={Position.Left} />}
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(NodeMenu);
