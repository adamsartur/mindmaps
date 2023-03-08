export default async function handler(req: any, res: any) {
  let response;
  console.log(req);
  response = "";
  res.status(200).json(response);
}
