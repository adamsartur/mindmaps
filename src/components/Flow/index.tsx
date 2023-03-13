import CreateElement from "components/CreateElement";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import useStore from "lib/store";
import ReactFlow, {
  ConnectionLineType,
  Panel,
  MiniMap,
  Background,
} from "reactflow";
import CustomNode from "./CustomNode";
import { shallow } from "zustand/shallow";
import styles from "./Flow.module.css";
import NodeMenu from "../Nodes/NodeMenu";
import LoaderOverlay from "components/LoaderOverlay";
import SaveMenu from "components/SaveMenu";
import AIMenu from "components/AIMenu";
import Condition from "components/Edges/Condition";

const nodeTypes = {
  custom: CustomNode,
  menu: NodeMenu,
};
const edgeTypes = {
  custom: Condition,
};

const defaultEdgeOptions = {
  // labelStyle: { fill: "#fff", fontWeight: 700 },
  // animated: true,
  // type: "smoothstep",
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
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Panel position="bottom-left">
          <CreateElement setIsLoading={setIsLoading} />
        </Panel>
        <Panel position="top-left">
          <AIMenu setIsLoading={setIsLoading} />
        </Panel>
        <Background />
        {!isSmallScreen && <MiniMap />}
        <SaveMenu setIsLoading={setIsLoading} />
      </ReactFlow>
    </div>
  );
}

export default Flow;
