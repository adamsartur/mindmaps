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
  type: "custom",
  source: "node1",
  target: "node2",
  data: { label: "Edge Label" },
};
const nodeText = JSON.stringify(node);
const edgeText = JSON.stringify(edge);

export default async function handler(req: any, res: any) {
  const requestBody = JSON.parse(Object.keys(req.body)[0]);
  let prePrompt = `we are in a react-flow app, designed for workflows just respond with a JSON: {nodes:[{}],edges:[{}]}; structure for node and edge:${nodeText} ${edgeText}`;
  let text = requestBody;
  let prompt = prePrompt + text;
  let response = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 504,
    temperature: 0,
    prompt,
  });
  console.log(requestBody);
  console.log(response.data.choices[0].text);
  res.status(200).json(response.data.choices[0].text);
}
