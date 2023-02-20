import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { supabase } from "@/lib/supabaseServerClient"
import { calculateFees, isValidTaprootAddress, uuidv4Regex } from "@/lib/utils"

const getSchema = z.object({
  id: z.string().regex(uuidv4Regex),
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
    const { id: orderId, uid } = parsedSchema

    const { data } = await supabase
      .from("order")
      .select(
        `id,created_at,network_fee,service_fee,payable_amount,recipient_address,priority_fee,status,assigned_taproot_address,
        inscription (commit,inscription,reveal,send_tx,created_at)
        `
      )
      .eq("id", orderId)
      .eq("uid", uid)
      .limit(1)
      .single()
    const { data: assetsData } = await supabase.storage
      .from("orders")
      .list(`${uid}/${orderId}`)
    const assets = assetsData.map((asset) => ({
      url: supabase.storage
        .from("orders")
        .getPublicUrl(`${uid}/${orderId}/${asset.name}`).data.publicUrl,
      size: asset.metadata.size,
      mimeType: asset.metadata.mimetype,
    }))
    return res.json({ ...data, assets })
  }
}
