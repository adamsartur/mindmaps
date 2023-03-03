import CreateElement from "components/CreateElement";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import useStore from "../../lib/store";
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Panel,
  MiniMap,
  Background,
} from "reactflow";
import CustomNode from "./CustomNode";
import { shallow } from "zustand/shallow";
import styles from "./Flow.module.css";
import NodeMenu from "./NodeMenu";
import LoaderOverlay from "components/LoaderOverlay";

const nodeTypes = {
  custom: CustomNode,
  menu: NodeMenu,
};

const defaultEdgeOptions = {
  animated: true,
  //type: "belzier",
};

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function Flow() {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [isLoading, setIsLoading] = useState(false);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  );

  return (
    <div className={styles.flow}>
      {isLoading && <LoaderOverlay />}
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Panel position="top-left">
          <CreateElement setIsLoading={setIsLoading} />
        </Panel>
        <Background />
        {!isSmallScreen && <MiniMap />}
      </ReactFlow>
    </div>
  );
}

export default Flow;
