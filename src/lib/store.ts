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
  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "Node 1" },
  //   position: { x: 250, y: 5 },
  // },
  // {
  //   id: "2",
  //   data: { label: "Node 2" },
  //   position: { x: 100, y: 100 },
  // },
  // {
  //   id: "3",
  //   data: { label: "Node 3" },
  //   position: { x: 400, y: 100 },
  // },
  // {
  //   id: "4",
  //   data: { label: "Node 4" },
  //   position: { x: 400, y: 200 },
  //   type: "custom",
  // },
  // {
  //   id: "5",
  //   data: { label: "abc" },
  //   position: { x: 500, y: 300 },
  //   type: "menu",
  // },
];
const sampleEdges: Edge[] = [
  // { id: "e1-2", source: "1", target: "2" },
  // { id: "e1-3", source: "1", target: "3" },
];

interface MindmapData {
  mindmapId: number;
  name: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

interface MindmapNode {
  id: number;
  label: string;
  x: number;
  y: number;
  color?: string;
  size?: number;
}

interface MindmapEdge {
  id: number;
  source: number;
  target: number;
  label?: string;
  color?: string;
}

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
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  updateNode: (id: string, data: any) => void;
  updateLabel: (id: string, label: string) => void;
  loadMap: () => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get, some) => ({
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
  setNodes: (nodes: Node[]) => {
    set({
      nodes,
    });
  },
  setEdges: (edges: Edge[]) => {
    set({
      edges,
    });
  },
  addNode: (node: Node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  addEdge: (edge: Edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
  loadMap: () => {
    api.get("/api/mindmaps").then(({ data }) => {
      console.log(data);
      const getNodes = data.nodes;
      const getEdges = data.edges;
      set((state: any) => ({
        ...state,
        nodes: getNodes,
        edges: getEdges,
        mindmapId: data.id,
        name: data.name,
      }));
    });
  },
  sendQuery: () => {
    api.get("/api/generate").then(({ data }) => {
      console.log(data);
      // const getNodes = data.nodes;
      // const getEdges = data.edges;
      // set((state: any) => ({
      //   ...state,
      //   nodes: getNodes,
      //   edges: getEdges,
      //   mindmapId: data.id,
      //   name: data.name,
      // }));
    });
  },
  updateNode: (id: string, data: any) =>
    set((state) => {
      const nodes = [...get().nodes];
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      nodes[nodeIndex] = { ...nodes[nodeIndex], data };
      console.log(id);
      console.log("updatedNode!!");
      return { nodes };
    }),
  updateLabel: (id: string, label: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, label } : node
      ),
    });
  },
}));

export default useStore;
