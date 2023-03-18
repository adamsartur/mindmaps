import CreateElement from "components/CreateElement";
import { useCallback, useEffect, useState } from "react";
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
import ContextMenu from "components/ContextMenu";

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
  const [contextMenu, setContextMenu] = useState<any>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  );
  const addNode = useStore((state) => state.addNode);
  const setNodes = useStore((state) => state.setNodes);
  const getNodeId = () => `${+new Date()}`;
  const handleDrag = () => {
    console.log("drag");
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (contextMenu && target && !target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const onAdd = useCallback(
    (event: any) => {
      console.log("onadd");
      const newNode = {
        id: getNodeId(),
        data: {
          label: "New node",
        },
        type: "menu",
        position: { x: event.clientX + 100, y: event.clientY },
      };
      console.log(newNode);
      setNodes([...nodes, newNode]);
    },
    [setNodes, nodes]
  );

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("handleContextMenu");

    console.log(event.clientX);
    console.log(event.clientY);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      items: [
        {
          id: "add",
          label: "Add node",
          onClick: (event: any) => {
            onAdd(event);
            console.log("onadd");
          },
        },
      ],
    });
  };

  const handleMenuSelection = (item: any) => {
    item.action();
    setContextMenu(null);
  };

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
        onContextMenu={handleContextMenu}
        fitView
        onDrag={handleDrag}
      >
        {contextMenu && (
          <ContextMenu
            posX={contextMenu.x}
            posY={contextMenu.y}
            menuOptions={contextMenu.items}
            //onItemSelected={}
          />
        )}
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
