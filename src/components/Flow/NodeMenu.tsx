import useStore from "lib/store";
import { memo, useEffect, useState } from "react";
import { Handle, Position, NodeToolbar, useNodeId, NodeProps } from "reactflow";

const NodeMenu = ({ id, data, xPos, yPos }: NodeProps) => {
  //const onNodeDelete = useStore((state) => state.nodeDelete());
  const deleteNode = useStore((state) => state.deleteNode);
  const addEdge = useStore((state) => state.addEdge);
  const addNode = useStore((state) => state.addNode);
  const updateNode = useStore((state) => state.updateNode);
  const [label, setLabel] = useState(data.label);

  const nodeId = useNodeId();

  // useEffect(() => {
  //     // save the label when editing ends
  //     updateNode(id, { data: { ...data, label } });
  // }, [handleLabelChange, updateNode]);

  function handleDelete() {
    console.log("Delete button clicked ", nodeId);
  }

  function handleEdit() {
    console.log("Edit button clicked");
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
    const newNodeId = Date.now().toString();
    const sourceNodeId = id;
    const targetNodeId = newNodeId;

    // add new node
    const newNode = {
      id: newNodeId,
      data: { label: "New Node" },
      type: "menu",
      position: {
        x: xPos + 200 || 0,
        y: yPos || 0,
      },
    };
    addNode(newNode);

    // add new edge
    const newEdge = {
      id: `${sourceNodeId}-${targetNodeId}`,
      source: sourceNodeId,
      target: targetNodeId,
    };
    addEdge(newEdge);
  }

  return (
    <>
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={data.toolbarPosition}
      >
        <button onClick={() => deleteNode(id)}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleExpand}>Expand</button>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleNewConnection}>New Connection</button>
      </NodeToolbar>
      <div style={{ padding: "10px 20px", cursor: "text" }}>
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          autoFocus
          style={{ width: "100%" }}
        />
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(NodeMenu);
