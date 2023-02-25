import type { NextApiRequest, NextApiResponse } from "next"
import { schemas } from "@/schemas"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { supabase } from "@/lib/supabaseClient"
import { calculateFees } from "@/lib/utils"

;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  if (req.method === "GET") {
    const schema = schemas["Orders"]["get"]
    let parsedSchema: z.infer<typeof schema>
    try {
      parsedSchema = schema.parse(req.query)
    } catch (e) {
      return res.status(400).json({ message: e.issues })
    }
    const { uid } = parsedSchema

    const result = await prisma.order.findMany({
      where: { uid },
      orderBy: { updated_at: "desc" },
      select: {
        status: true,
        id: true,
        created_at: true,
        updated_at: true,
        files: { select: { mime_type: true, id: true, name: true, status: true } },
      },
    })

    result.forEach((item) => {
      let uiOrderStatusTitle = ""
      const fileStatuses = item.files.map(f => f.status)
      const totalFiles = item.files.length
      if (fileStatuses.some(val => val.includes("fail"))) {
        uiOrderStatusTitle = "Partially Failed"
      } else if (fileStatuses.every(val => val.includes("sent"))) {
        uiOrderStatusTitle = `Inscription${totalFiles > 1 ? 's' : ''} sent`
      } else if (fileStatuses.every(val => val.includes("broadcast"))) {
        uiOrderStatusTitle = `Inscription${totalFiles > 1 ? 's' : ''} broadcasted`
      }
      ;(item as any).uiOrderStatusTitle = uiOrderStatusTitle
      item.files.forEach((file) => {
        ;(file as any).asset_url = supabase.storage
          .from("orders")
          .getPublicUrl(`${uid}/${item.id}/${file.id}`).data.publicUrl
      })
    })

    return res.json({ orders: result })
  }

  let parsedSchema: z.infer<(typeof schemas)["Orders"]["post"]>
  try {
    parsedSchema = schemas["Orders"]["post"].parse(req.body)
  } catch (e) {
    return res.status(400).json({ message: e.issues })
  }

  const {
    orderId,
    fileName,
    priorityFee,
    recipientAddress,
    txSpeed,
    assignedAddress,
    mimeType,
    fileSize,
    uid,
  } = parsedSchema

  const { networkFees, serviceFees, totalFees } = calculateFees(
    fileSize,
    priorityFee
  )

  console.log({ networkFees, serviceFees, totalFees })

  try {
    const order = await prisma.order.upsert({
      where: { id: orderId },
      create: {
        total_payable_amount: totalFees,
        id: orderId,
        uid,
      },
      update: {
        updated_at: new Date(),
        total_payable_amount: {
          increment: totalFees,
        },
      },
      select: {
        total_payable_amount: true,
        id: true,
        files: { select: { assigned_taproot_address: true } },
      },
    })

    const result = await prisma.file.create({
      data: {
        network_fee: networkFees,
        service_fee: serviceFees,
        priority_fee: priorityFee,
        tx_speed: txSpeed,
        recipient_address: recipientAddress,
        assigned_taproot_address: assignedAddress,
        name: fileName,
        order_id: order.id,
        payable_amount: totalFees,
        mime_type: mimeType,
        is_service_fee_exempt: true
      },
      select: {
        id: true,
        assigned_taproot_address: true,
        priority_fee: true,
        order: { select: { id: true, total_payable_amount: true } },
      },
    } as any)

    return res.json({ ...result })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: "Internal server error" })
  }
}
