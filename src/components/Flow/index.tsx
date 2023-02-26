import CreateElement from "components/CreateElement";
import { useCallback } from "react";
import { useMediaQuery } from "@mui/material";
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

import styles from "./Flow.module.css";
import NodeMenu from "./NodeMenu";

const sampleNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Node 3" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    data: { label: "Node 4" },
    position: { x: 400, y: 200 },
    type: "custom",
    className: styles.customNode,
  },
  {
    id: "5",
    data: { label: "abc" },
    position: { x: 500, y: 300 },
    type: "menu",
    className: styles.customNode,
  },
];
const sampleEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

//const storedNodes = sessionStorage.getItem("nodes");
const storedNodes = null;
const initialNodes = storedNodes ? JSON.parse(storedNodes) : sampleNodes;

//const storedEdges = sessionStorage.getItem("edges");
const storedEdges = null;
const initialEdges = storedEdges ? JSON.parse(storedEdges) : sampleEdges;

const nodeTypes = {
  custom: CustomNode,
  menu: NodeMenu,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

function Flow() {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={styles.flow}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Panel position="top-left">
          <CreateElement />
        </Panel>
        <Background />
        {!isSmallScreen && <MiniMap />}
      </ReactFlow>
    </div>
  );
}

export default Flow;
