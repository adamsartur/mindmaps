import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const requestBody = JSON.parse(Object.keys(req.body)[0]);

  const { name, nodes, edges, mindMapId } = requestBody;

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
