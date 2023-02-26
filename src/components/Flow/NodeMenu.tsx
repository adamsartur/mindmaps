import { memo } from "react";
import { Handle, Position, NodeToolbar, useNodeId } from "reactflow";

const NodeMenu = ({ data }: any) => {
  const nodeId = useNodeId();
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

  function handleNewConnection() {
    console.log("New Connection button clicked");
  }

  return (
    <>
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={data.toolbarPosition}
      >
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleExpand}>Expand</button>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleNewConnection}>New Connection</button>
      </NodeToolbar>
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(NodeMenu);
