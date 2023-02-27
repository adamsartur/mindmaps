import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  let response;
  response = await prisma.mindMaps.findFirst();
  res.status(200).json(response);
}

// export default async function handler(req: any, res: any) {
//   const {
//     mindMapId,
//     nodes = [],
//     edges = [],
//     name,
//   } = JSON.parse(event.body) as ManageMindMap;

//   console.log(edges);

//   let result;
//   const mindMapData: any = {
//     name: name,
//   };
//   if (nodes && nodes.length > 0) {
//     mindMapData.nodes = nodes;
//   }
//   if (edges && edges.length > 0) {
//     mindMapData.edges = edges;
//   }

//   console.log(mindMapData);
//   result = await prisma.mindMaps.create({
//     data: mindMapData,
//   });

//   await prisma.mindMaps.delete({
//     where: {
//       id: mindMapId,
//     },
//   });

//   res.status(200).json({ name: "John Doe" });
// }
