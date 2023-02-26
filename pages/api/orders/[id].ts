import type { NextApiRequest, NextApiResponse } from "next"
import { schemas } from "@/schemas"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { supabase } from "@/lib/supabaseClient"

const prisma = new PrismaClient()

;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

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
        total_payable_amount: true,
        status: true,
        files: {
          select: {
            id: true,
            status: true,
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
        ;(file as any).asset_url = supabase.storage
          .from("orders")
          .getPublicUrl(`${uid}/${orderId}/${file.id}`).data.publicUrl
      })
    }

    const fileStatuses = result.files.map((item) => item.status)
    const totalFiles = result.files.length
    let uiOrderStatusTitle = ""
    let uiOrderStatusSubTitle = ""
    if (fileStatuses.some((item) => item.startsWith("failed"))) {
      if (totalFiles > 1) {
        uiOrderStatusTitle = "Some files have failed in the process"
      } else {
        uiOrderStatusTitle =
          "The file failed to inscribe somewhere in the process"
      }
      uiOrderStatusSubTitle =
        "Please get in touch with anasy#9409 on Discord or DM us on Twitter @inscribit_xyz to resolve this as soon as possible"
    } else if (
      fileStatuses.every((item) => item === "inscription_sent_confirmed")
    ) {
      if (totalFiles > 1) {
        uiOrderStatusTitle =
          "All the files have been inscribed and sent to you!"
        uiOrderStatusSubTitle =
          "Enjoy your inscriptions! Let us know if you have any feedback. We'd love to hear from you!"
      } else {
        uiOrderStatusSubTitle =
          "Enjoy your inscription! Let us know if you have any feedback. We'd love to hear from you!"
        uiOrderStatusTitle = "The file has been inscribed and sent to you!"
      }
    } else if (fileStatuses.every((item) => item === "inscription_sent")) {
      if (totalFiles > 1) {
        uiOrderStatusTitle = "All files have been inscribed and sent to you!"
      } else {
        uiOrderStatusTitle = "The file has been inscribed and sent to you!"
      }
      uiOrderStatusSubTitle =
        "Waiting for at least 1 confirmation by the network"
    } else if (fileStatuses.some((item) => item === "broadcasted")) {
      if (totalFiles > 1) {
        uiOrderStatusTitle =
          "The inscriptions are being broadcasted to the network"
        uiOrderStatusSubTitle =
          "Waiting for at least 1 confirmation before proceeding to send them to you"
      } else {
        uiOrderStatusTitle =
          "The inscription is being broadcasted to the network"
        uiOrderStatusSubTitle =
          "Waiting for at least 1 confirmation before proceeding to send it to you"
      }
    }

    return res.json({
      uiOrderStatusTitle,
      uiOrderStatusSubTitle,
      ...result,
    })
  }
}
