import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  let response;
  response = await prisma.mindMaps.findFirst({
    where: {
      userId: "ef7b6a28-ecec-40f9-8b16-d1d021c15ddb",
    },
  });
  res.status(200).json(response);
}
