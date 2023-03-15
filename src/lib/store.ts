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
  Position,
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
  isDirty: boolean;
  loadingMap: boolean;
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
  loadMap: (id: string) => void;
  //setPositions: () => void;
  generate: (instructions: string) => void;
  addCompletion: (instructions: string) => void;
  getParentParams: (id: string) => any;
  setNodeParams: (id: string) => void;
  setEdge: (edge: any) => void;
  setEdgeParams: (id: string, newParams: any) => void;
};

interface ParamObjProps {
  key: string;
  value: string;
  operation?: string;
}

function compareParams(
  ruleParams: ParamObjProps[],
  testParams: ParamObjProps[]
) {
  if (
    !ruleParams ||
    !testParams ||
    ruleParams.length === 0 ||
    testParams.length === 0
  ) {
    return true; // no validation needed
  }
  const ruleParamsArray = Array.isArray(ruleParams) ? ruleParams : [ruleParams];
  const ruleMap = new Map(
    ruleParamsArray.map(({ key, value }) => [key, value])
  );
  const testParamsArray = Array.isArray(testParams) ? testParams : [testParams];
  for (const { key, value, operation = "equals" } of testParamsArray) {
    if (!ruleMap.has(key)) {
      continue; // skip if key not present in ruleParams
    }
    console.log("match! lets test");

    const ruleValue = ruleMap.get(key);

    switch (operation) {
      case "equals":
        console.log("equals");
        if (value !== ruleValue) {
          return false;
        }
        break;
      case "not-equals":
        console.log("not");
        if (value === ruleValue) {
          return false;
        }
        break;
      case "greater-than":
        console.log("greater");
        if (Number(value) <= Number(ruleValue)) {
          return false;
        }
        break;
      case "less-than":
        console.log("less");
        if (Number(value) >= Number(ruleValue)) {
          return false;
        }
        break;
      case "includes":
        console.log("includes");
        if (!ruleValue!.includes(value)) {
          return false;
        }
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
  }
  console.log("true");
  return true;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get, some) => ({
  nodes: initialNodes,
  edges: initialEdges,
  name: "",
  isDirty: false,
  loadingMap: false,
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
  setEdge: (edge: any) => {
    const updatedEdges = get().edges.map((e) => {
      if (e.id === edge.id) {
        return edge;
      } else {
        return e;
      }
    });
    set({ edges: updatedEdges });
  },
  addNode: (node: Node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  addEdge: (edge: Edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
  loadMap: (id: string) => {
    api.post("/api/mindmaps", JSON.stringify(id)).then(({ data }) => {
      const getNodes = data.nodes;
      const getEdges = data.edges;
      set((state: any) => ({
        ...state,
        nodes: getNodes,
        edges: getEdges,
        mindmapId: data.id,
        name: data.name,
        loadingMap: true,
      }));
    });
  },
  generate: (instructions: string) => {
    api.post("/api/generate", JSON.stringify(instructions)).then(({ data }) => {
      const parsedData = JSON.parse(data);
      const { nodes: pNodes, edges: pEdges } = parsedData;
      set({
        nodes: pNodes,
      });
      set({
        edges: pEdges,
      });
    });
  },
  addCompletion: (instructions: string) => {
    api
      .post("/api/addgenerate", JSON.stringify(instructions))
      .then(({ data }) => {
        const parsedData = JSON.parse(data);

        const { nodes: pNodes, edges: pEdges } = parsedData;
        set((state) => ({
          nodes: [...state.nodes, ...pNodes],
          edges: [...state.edges, ...pEdges],
        }));
      });
  },
  updateNode: (id: string, data: any) =>
    set((state) => {
      const nodes = [...get().nodes];
      const nodeIndex = nodes.findIndex((node: any) => node.id === id);
      nodes[nodeIndex] = { ...nodes[nodeIndex], data };
      return { nodes };
    }),
  updateLabel: (id: string, label: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, label } : node
      ),
    });
  },
  setEdgeParams: (id: string, newParams: any) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              params: newParams,
            },
          };
        }
        return edge;
      }),
    });
  },
  setNodeParams: (nodeId: string) => {
    console.log(nodeId);
    //get current node
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    //get edges from current node
    const edges = get().edges.filter((e) => e.source === nodeId);
    console.log(edges);
    // determine all the nodes connected to the given node
    const connectedNodes = edges.map((e) => e.target);

    // determine all the node ids connected to the given node
    const edgeIds = edges.map((e) => e.id);
    console.log(edgeIds);

    // set state with node params value
    //set({ nodeParams: node.data.params });

    // loop all nodes
    get().nodes.forEach((n) => {
      console.log(n);
      //for connected nodes
      if (connectedNodes.includes(n.id)) {
        //compare params
        const edge = get().edges.find((e) => e.target === n.id);
        const edgeParams = edge!.data.params;
        const nodeParams = node.data.params;
        const isActive = compareParams(edgeParams, nodeParams);
        const isActiveClass = isActive ? "valid" : "invalid";

        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === n.id) {
              return {
                ...node,
                className: isActiveClass,
              };
            }
            return node;
          }),
        }));
      } else {
        //for not connected nodes
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === n.id) {
              return {
                ...node,
              };
            }
            return node;
          }),
        }));
      }
      console.log(get().nodes);
    });
  },
  getParentParams: (id: string) => {
    console.log("params");
    console.log(id);
    const edge = get().edges.find((edge) => edge.id === id);
    console.log(edge);
    if (!edge) {
      return [];
    }

    const parentNodes: Node[] = [];

    const findParentNodes = (id: string) => {
      const edge = get().edges.find((edge) => edge.id === id);
      console.log(edge);
      console.log("edge");
      if (edge) {
        const parentNode = get().nodes.find((node) => node.id === edge.source);
        if (parentNode) {
          parentNodes.push(parentNode);
          findParentNodes(parentNode.id);
        }
      }
    };
    console.log("findParentNodes");

    findParentNodes(id);

    console.log(parentNodes);

    const params = parentNodes.map(
      (node) => (
        console.log(node),
        {
          id: node.id,
          params: node.data.params,
        }
      )
    );

    return params;
  },
}));

export default useStore;

//to fix

// setPositions: () => {
//   console.log("set");
//   const nodes = get().nodes;
//   const edges = get().edges;

//   const getChildren = (parentId: string, edges: Edge[]) =>
//     edges
//       .filter((edge) => edge.source === parentId)
//       .map((edge) => edge.target);

//   const X_STEP = 150;
//   const Y_STEP = 100;

//   const visited: { [nodeId: string]: boolean } = {};
//   // mark all nodes as not visited
//   Object.keys(nodes).forEach((id) => {
//     visited[id] = false;
//   });

//   const nodePositions: { [nodeId: string]: { x: number; y: number } } = {};

//   const traverseGraph = (
//     nodeId: string,
//     nodes: Node[],
//     edges: Edge[]
//   ): { id: string; position: { x: number; y: number } }[] => {
//     // mark node as visited
//     visited[nodeId] = true;

//     // calculate new position based on parent position and number of children
//     const node = nodes.find((n) => n.id === nodeId);
//     if (!node) {
//       return [];
//     }
//     const childIds = edges
//       .filter((e) => e.source === nodeId)
//       .map((e) => e.target);
//     const numChildren = childIds.length;
//     let newPos: { x: number; y: number };
//     let parentPos = node.position;
//     if (numChildren === 0) {
//       newPos = parentPos;
//     } else if (numChildren === 1) {
//       newPos = { x: parentPos.x + X_STEP, y: parentPos.y };
//     } else {
//       const firstChildId = childIds[0];
//       const lastChildId = childIds[numChildren - 1];
//       const firstChildPos = visited[firstChildId]
//         ? nodePositions[firstChildId]
//         : traverseGraph(firstChildId, nodes, edges);
//       const lastChildPos = visited[lastChildId]
//         ? nodePositions[lastChildId]
//         : traverseGraph(lastChildId, nodes, edges);
//       newPos = {
//         x: (firstChildPos.x + lastChildPos.x) / 2,
//         y: parentPos.y + Y_STEP,
//       };
//     }

//     // update node position and save to positions object
//     nodePositions[nodeId] = newPos;
//     nodes = nodes.map((n) =>
//       n.id === nodeId ? { ...n, position: newPos } : n
//     );

//     // return array of id and position objects for all nodes
//     const results = [{ id: nodeId, position: { x: newPos.x, y: newPos.y } }];
//     for (const childId of childIds) {
//       results.push(...traverseGraph(childId, nodes, edges));
//     }
//     return results;
//   };

//   // traverse the graph starting from each unvisited node
//   Object.keys(nodes).forEach((id) => {
//     if (!visited[id]) {
//       traverseGraph(id, nodes, edges);
//     }
//   });

//   // update state with new node positions
//   set({
//     nodes: nodes,
//   });
// },
