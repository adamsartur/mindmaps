import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  let response;
  response = await prisma.mindMaps.findFirst();
  res.status(200).json(response);
}
