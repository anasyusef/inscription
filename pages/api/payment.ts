import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import { chunk, merge } from "lodash"

import { bitcoinMempool } from "@/lib/mempool"
import { supabase } from "@/lib/supabaseServerClient"
import { calculateFees } from "@/lib/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { data } = await supabase
    .from("order")
    .select("id,assigned_taproot_address,payable_amount")
    .or("status.eq.payment_pending,status.eq.payment_below_payable_amount").limit(10)

  if (data.length < 1) {
    return res.json({ message: "ok" })
  }

  console.log(data)
  const assignedAddresses = data.map((item) => item.assigned_taproot_address)
  const chunkAddresses = chunk(assignedAddresses, 150)
  const promises = chunkAddresses.map((item) =>
    axios.get(`https://blockchain.info/balance?active=${item.join("|")}`)
  )
  const resolvedPromises = await Promise.all(promises)
  const chunkedData = resolvedPromises.map((item) => item.data)
  const mergedData = chunkedData.reduce(
    (prev, curr) => ({ ...prev, ...curr }),
    {}
  )

  console.log(mergedData)

  const addressesToUpdate = new Map()

  // data.forEach((item) => {
  //   if (mergedData.)
  // })


  // console.log(Object.keys(mergedData).length)
  // return res.json({ mergedData })

  return res.status(200).json({ message: "ok" })
}
