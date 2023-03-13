import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  let response;

  let userId = "ef7b6a28-ecec-40f9-8b16-d1d021c15ddb";
  response = await prisma.mindMaps.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
    },
  });
  res.status(200).json(response);
}
