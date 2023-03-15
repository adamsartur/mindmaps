import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const requestBody = JSON.parse(Object.keys(req.body)[0]);

  const { name, nodes, edges, mindmapId, userId } = requestBody;

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

  //function that updates prisma mindmaps data based on data from response, where userID and mindmapid are the same values
  //if mindmapid is not present, create a new mindmap
  //if mindmapid is present, update the mindmap with the new data
  //if mindmapid is present, but the user id is different, create a new mindmap
  if (!mindmapId) {
    // check if mindmapId is null or empty string
    result = await prisma.mindMaps.create({
      data: {
        name: name,
        nodes: nodes,
        edges: edges,
        userId: mindMapData.userId,
      },
    });
  } else {
    result = await prisma.mindMaps.upsert({
      where: {
        id: mindmapId,
      },
      create: {
        name: name,
        nodes: nodes,
        edges: edges,
        userId: mindMapData.userId,
      },
      update: {
        name: name,
        nodes: nodes,
        edges: edges,
        userId: mindMapData.userId,
      },
    });
  }

  // result = await prisma.mindMaps.create({
  //   data: mindMapData,
  // });

  // await prisma.mindMaps.delete({
  //   where: {
  //     id: mindMapId,
  //   },
  // });

  res.status(200).json(result);
}
