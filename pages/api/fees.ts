import type { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const BASE_FEE = 10_000
const PCT_FEE = 0.1
const MAX_FILE_SIZE = 390 * 1_000
const schema = z
  .object({
    size: z.coerce.number().positive().max(MAX_FILE_SIZE),
    priorityFee: z.coerce.number().positive(),
  })
  .required()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
  }

  let parsedSchema: z.infer<typeof schema>
  try {
    parsedSchema = schema.parse(req.query)
  } catch (e: any) {
    return res.status(400).json({ message: e.issues })
  }

  const chainFee = parsedSchema.size * parsedSchema.priorityFee
  const serviceFee = chainFee * PCT_FEE + BASE_FEE

  res.status(200).json({ chainFee, serviceFee })
}
