import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { supabase } from "@/lib/supabaseServerClient"
import { calculateFees, isValidTaprootAddress, uuidv4Regex } from "@/lib/utils"

const postSchema = z
  .object({
    priorityFee: z.number().positive().max(99999),
    txSpeed: z.enum(["slow", "normal", "fast", "custom"]),
    recipientAddress: z.string().refine(isValidTaprootAddress, (val) => ({
      message: `${val} is not an ordinal-compatible address`,
    })),
    combinedFileSizes: z.number().positive(),
    uid: z.string().regex(uuidv4Regex),
  })
  .required()

const getSchema = z.object({
  orderId: z.string().regex(uuidv4Regex),
  uid: z.string().regex(uuidv4Regex),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  if (req.method === "GET") {
    let parsedSchema: z.infer<typeof getSchema>
    try {
      parsedSchema = getSchema.parse(req.query)
    } catch (e) {
      return res.status(400).json({ message: e.issues })
    }
    const { orderId, uid } = parsedSchema

    const { data } = await supabase
      .from("order")
      .select(
        `id,network_fee,service_fee,payable_amount,recipient_address,priority_fee,status,assigned_taproot_address,
        inscription (commit,inscription,reveal,created_at)
        `
      )
      .eq("id", orderId)
      .eq("uid", uid)
      .limit(1)
      .single()
    console.log(data)
    const { data: assetsData } = await supabase.storage
      .from("orders")
      .list(`${uid}/${orderId}`)
    const assets = assetsData.map((asset) => ({
      url: supabase.storage
        .from("orders")
        .getPublicUrl(`${uid}/${orderId}/${asset.name}`).data.publicUrl,
      size: asset.metadata.size,
    }))
    return res.json({ ...data, assets })
  }

  let parsedSchema: z.infer<typeof postSchema>
  try {
    parsedSchema = postSchema.parse(req.body)
  } catch (e) {
    return res.status(400).json({ message: e.issues })
  }

  const { combinedFileSizes, priorityFee, recipientAddress, txSpeed, uid } =
    parsedSchema

  const { networkFees, serviceFees, totalFees } = calculateFees(
    combinedFileSizes,
    priorityFee
  )

  const {
    data: { address: assignedAddress },
  } = await axios.get(`${process.env.NEXT_BACKEND_URL}/wallet`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_SECRET_BACKEND_API_KEY}`,
    },
  })

  const orderId = uuidv4()

  const { error } = await supabase.from("order").insert({
    uid, // User ID
    id: orderId,
    network_fee: networkFees,
    payable_amount: totalFees,
    service_fee: serviceFees,
    priority_fee: priorityFee,
    tx_speed: txSpeed,
    recipient_address: recipientAddress,
    assigned_taproot_address: assignedAddress,
  })

  if (error) {
    console.log(error)
    return res.status(400).json({ message: "Something unexpected happened" })
  }

  return res.status(200).json({
    uid,
    orderId,
    assignedAddress,
    recipientAddress,
    totalFees,
    priorityFee,
  })
}
