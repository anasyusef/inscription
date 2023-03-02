import { z } from "zod"

import { isValidTaprootAddress, uuidv4Regex } from "@/lib/utils"

export const schemas = {
  Orders: {
    post: z
      .object({
        priorityFee: z.number().positive().max(99999),
        txSpeed: z.enum(["slow", "normal", "fast", "custom"]),
        recipientAddress: z.string().refine(isValidTaprootAddress, (val) => ({
          message: `${val} is not an ordinal-compatible address`,
        })),
        orderId: z.string().regex(uuidv4Regex),
        fileName: z.string().trim(),
        fileSize: z.number().positive(),
        mimeType: z.string().trim(),
        assignedAddress: z.string().refine(isValidTaprootAddress, (val) => ({
          message: `${val} is not an ordinal-compatible address`,
        })),
        uid: z.string().regex(uuidv4Regex),
        ref: z.string().nullable(),
      })
      .required(),
    get: z
      .object({
        uid: z.string().regex(uuidv4Regex),
      })
      .required(),
  },
  Order: {
    get: z.object({
      id: z.string().regex(uuidv4Regex),
      uid: z.string().regex(uuidv4Regex),
    }),
  },
}
