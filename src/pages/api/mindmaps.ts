import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  let response;
  const requestBody = JSON.parse(Object.keys(req.body)[0]);
  console.log(requestBody);
  let id = requestBody ? requestBody : "5d9af3d4-fdef-4285-af18-61404215ce98";
  response = await prisma.mindMaps.findFirst({
    where: {
      id,
    },
  });
  res.status(200).json(response);
}
