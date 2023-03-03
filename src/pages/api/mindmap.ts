import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const requestBody = JSON.parse(Object.keys(req.body)[0]);

  const { name, nodes, edges, mindMapId, userId } = requestBody;

  let result;
  const mindMapData: any = {
    name: name,
  };
  if (nodes && nodes.length > 0) {
    mindMapData.nodes = nodes;
  }
  if (edges && edges.length > 0) {
    mindMapData.edges = edges;
  }
  if (userId) {
    mindMapData.userId = userId;
  } else {
    mindMapData.userId = "ef7b6a28-ecec-40f9-8b16-d1d021c15ddb";
  }

  result = await prisma.mindMaps.create({
    data: mindMapData,
  });

  await prisma.mindMaps.delete({
    where: {
      id: mindMapId,
    },
  });

  res.status(200).json(result);
}
