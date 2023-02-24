import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
  }

  const {
    data: { address },
  } = await axios.get(`${process.env.NEXT_BACKEND_URL}/wallet`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_SECRET_BACKEND_API_KEY}`,
    },
  })

  res.status(200).json({ address })
}
