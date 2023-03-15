const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(config);

const node = {
  id: "node-id",
  type: "menu",
  position: { x: 250, y: 5 },
  data: { label: "Node" },
};
const edge = {
  id: "edge-id",
  // type: "custom",
  source: "node1",
  target: "node2",
  label: "Edge Label",
};

type Node = {
  id: string;
  type: string;
  position?: { x: number; y: number };
  data: { label: string };
  [key: string]: any;
};

type Edge = {
  id: string;
  type: string;
  source: string;
  target: string;
  label?: string;
  [key: string]: any;
};

type OptimizedNode = {
  i: string;
  t: string;
  p?: { x: number; y: number };
  d: { l: string };
  [key: string]: any;
};

type OptimizedEdge = {
  i: string;
  t: string;
  s: string;
  tg: string;
  d?: { l: string };
  [key: string]: any;
};

function optimizeFlowchart(
  nodes: Node[],
  edges: Edge[]
): { n: OptimizedNode[]; e: OptimizedEdge[] } {
  const optimizedNodes = nodes.map(({ id, type, data, position, ...rest }) => ({
    i: id,
    t: type,
    d: { l: data.label },
    ...(position && { p: position }),
    ...rest,
  }));

  const optimizedEdges = edges.map(
    ({ id, type, source, target, label, ...rest }) => ({
      i: id,
      t: type,
      s: source,
      tg: target,
      ...(label && { d: { l: label } }),
      ...rest,
    })
  );

  return { n: optimizedNodes, e: optimizedEdges };
}

function fromOptimizedFlowchart(optimizedFlowchart: {
  n: OptimizedNode[];
  e: OptimizedEdge[];
}): { nodes: Node[]; edges: Edge[] } {
  const nodes = optimizedFlowchart.n.map(({ i, t, d, p, ...rest }) => ({
    id: i,
    type: t,
    data: { label: d.l },
    ...(p && { position: p }),
    ...rest,
  }));

  const edges = optimizedFlowchart.e.map(({ i, t, s, tg, d, ...rest }) => ({
    id: i,
    type: t,
    source: s,
    target: tg,
    ...(d && d.l && { label: d.l }),
    ...rest,
  }));

  return { nodes, edges };
}

const nodeText = JSON.stringify(node);
const edgeText = JSON.stringify(edge);

export default async function handler(req: any, res: any) {
  const requestBody = JSON.parse(Object.keys(req.body)[0]);
  let prePrompt = `we are in a react-flow app, please just respond with a JSON: {nodes:[{}],edges:[{}]}; a node can have multiple target nodes; flows can have loops. structure for node and edge:${nodeText} ${edgeText}`;
  let text = requestBody;
  let prompt = prePrompt + text;
  let response = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 1500,
    temperature: 0,
    prompt,
  });
  console.log(requestBody);
  console.log(response.data.choices[0].text);
  res.status(200).json(response.data.choices[0].text);
}
