import type { NextApiRequest, NextApiResponse } from "next"

import { bitcoinMempool } from "@/lib/mempool"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
  }

  const { fees } = bitcoinMempool
  const feesRecommended = await fees.getFeesRecommended()

  const { halfHourFee, fastestFee, hourFee } = feesRecommended

  res.status(200).json({ slow: hourFee, normal: halfHourFee, fast: fastestFee })
}
