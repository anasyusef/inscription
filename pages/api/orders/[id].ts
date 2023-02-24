import type { NextApiRequest, NextApiResponse } from "next"
import { schemas } from "@/schemas"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { supabase } from "@/lib/supabaseClient"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  if (req.method === "GET") {
    const schema = schemas["Order"]["get"]
    let parsedSchema: z.infer<typeof schema>
    try {
      parsedSchema = schema.parse(req.query)
    } catch (e) {
      return res.status(400).json({ message: e.issues })
    }
    const { id: orderId, uid } = parsedSchema

    const result = await prisma.order.findFirst({
      where: { id: orderId, AND: { uid } },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        files: {
          select: {
            id: true,
            assigned_taproot_address: true,
            commit_tx: true,
            inscription_id: true,
            network_fee: true,
            priority_fee: true,
            service_fee: true,
            send_tx: true,
            reveal_tx: true,
            recipient_address: true,
            name: true,
            mime_type: true,
          },
        },
      },
    })
    if (result) {
      result.files.forEach((file) => {
        ;(file as any).assetUrl = supabase.storage
          .from("orders")
          .getPublicUrl(`${uid}/${orderId}/${file.id}`).data.publicUrl
      })
    }
    return res.json({ ...result })
  }
}
