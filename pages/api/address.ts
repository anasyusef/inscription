import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const {
      data: { address },
    } = await axios.get(`${process.env.BACKEND_URL}/wallet`, {
      headers: {
        Authorization: `Bearer ${process.env.SECRET_BACKEND_API_KEY}`,
      },
    })
    return res.status(200).json({ address })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data)
    } else {
      console.log(e)
    }
    return res.status(500).json({ message: "Internal server error" })
  }
}
