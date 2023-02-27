import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

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
  // {
  //   id: "4",
  //   data: { label: "Node 4" },
  //   position: { x: 400, y: 200 },
  //   type: "custom",
  // },
  {
    id: "5",
    data: { label: "abc" },
    position: { x: 500, y: 300 },
    type: "menu",
  },
];
const sampleEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

const initialNodes = sampleNodes;
const initialEdges = sampleEdges;

import { api } from "./axios";

type RFState = {
  nodes: Node[];
  edges: Edge[];
  mindmapId?: string;
  name: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  deleteNode: (nodeId: string) => void;
  setMindmapId: (id: string) => void;
  setName: (name: string) => void;
};

api
  .get("/api/mindmaps")
  .then(({ data }) => {
    console.log(data);
    const getNodes = data.nodes;
    const getEdges = data.edges;
    useStore.setState({
      nodes: getNodes,
      edges: getEdges,
      mindmapId: data.id,
      name: data.name,
    });
  })
  .catch((error) => console.log(error));

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  name: "",
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    console.log("Edges changed:", changes);
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    console.log("Connection changed:", connection);
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  deleteNode: (nodeId: string) => {
    const nodes = get().nodes.filter((node) => node.id !== nodeId);
    const edges = get().edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
    set({ nodes, edges });
    console.log({ nodes, edges });
  },
  setName: (name: string) => {
    set({
      name,
    });
  },
  setMindmapId: (id: string) => {
    set({
      mindmapId: id,
    });
  },
}));

export default useStore;
