import { InputAsset } from "@/types"
import { getAddressInfo } from "bitcoin-address-validation"
import { ClassValue, clsx } from "clsx"
import { format, parseISO } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum Status {
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_RECEIVED_UNCONFIRMED = "payment_received_unconfirmed",
  PAYMENT_RECEIVED_CONFIRMED = "payment_received_confirmed",
  PAYMENT_UNDERPAID = "payment_underpaid",
  PAYMENT_OVERPAID = "payment_overpaid",
  PAYMENT_OVERPAID_CONFIRMED = "payment_overpaid_confirmed",
  BROADCASTED = "broadcasted",
  BROADCASTED_CONFIRMED = "broadcasted_confirmed",
  INSCRIPTION_SENT = "inscription_sent",
  INSCRIPTION_SENT_CONFIRMED = "inscription_sent_confirmed",
}

export const ORDER_PENDING = [
  Status.PAYMENT_PENDING,
  Status.PAYMENT_UNDERPAID,
  Status.PAYMENT_OVERPAID,
  Status.PAYMENT_RECEIVED_UNCONFIRMED,
]

export const calculateFees = (
  size: number,
  priorityFee: number,
) => {
  const inscriptionValue = 10_000
  const baseFee = +(process.env.NEXT_PUBLIC_BASE_FEE || 0) * 100_000_000
  const segwitFileSize = size / 4
  const networkFees =
    (segwitFileSize + +(process.env.NEXT_PUBLIC_BASE_NETWORK_FEE || 0)) *
      priorityFee +
    inscriptionValue
  const serviceFees =
    (networkFees + inscriptionValue) * +(process.env.NEXT_PUBLIC_PCT_FEE || 0) +
    baseFee

  return {
    networkFees: Math.floor(networkFees),
    serviceFees: Math.floor(serviceFees),
    totalFees: Math.floor(networkFees + serviceFees),
    inscriptionValue,
  }
}

export const isValidTaprootAddress = (address: string) => {
  try {
    const { network, type, bech32 } = getAddressInfo(address)
    if (network !== "mainnet" || type !== "p2tr" || !bech32) {
      return false
    }
    return true
  } catch (e) {
    return false
  }
}

export const uuidv4Regex =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function parseFileSize(size: number) {
  if (size < 1000) {
    return `${size} bytes`
  }
  return `${Math.round((size / 1000) * 100) / 100} kB`
}

export const STATUS = {
  payment_pending: { parsed: "Awaiting Payment", info: "" },
  payment_received_unconfirmed: {
    parsed: "Payment received",
    info: "Waiting for at least 1 confirmation",
  },
  payment_received_confirmed: {
    parsed: "Payment received",
    info: "Payment has been received and it has at least 1 confirmation. Proceeding to inscribe the files",
  },
  payment_underpaid: {
    parsed: "Payment is less than expected",
    info: "Please send the amount remaining to proceed with the inscription. In case of any issues, please contact us",
  },
  payment_overpaid: {
    parsed: "Payment is more than expected",
    info: "We received more than expected, waiting for at least 1 confirmation",
  },
  payment_overpaid_confirmed: {
    parsed: "Payment is more than expected",
    info: "We'll inscribe the asset received but please get in touch to request a refund of the difference",
  },
  broadcasted: {
    parsed: "Inscription broadcasted",
    info: "Waiting for the transaction to have at least 1 confirmation by the network. Once confirmed, we'll send it to you",
  },
  broadcasted_confirmed: {
    parsed: "Broadcasted transaction confirmed",
    info: "Sending the ordinal inscription to the recipient address",
  },
  inscription_sent: {
    parsed: "Inscription sent",
    info: "Waiting for at least 1 confirmation",
  },
  inscription_sent_confirmed: {
    parsed: "Inscription sent",
    info: "The inscription has been sent and confirmed! If you have any questions or concerns, don't hesitate to reach out to us. Enjoy your inscription!",
  },
  refunded: {
    parsed: "Refunded",
    info: "This order has been refunded and the amount has been sent to the recipient address",
  },
} as const

export const FILE_STATUS = {
  pending: {
    parsed: "Pending to inscribe",
    info: (file_name: string) =>
      `${file_name} is now queued to inscribe. It should proceed to inscribe shortly`,
  },
  inscribing: {
    parsed: "Inscribing",
    info: (file_name: string) => `Inscribing ${file_name}`,
  },
  failed_to_inscribe: {
    parsed: "Failed to inscribe",
    info: (file_name: string) =>
      `Failed to inscribe ${file_name}. Please reach out to us to have this resolved as soon as possible`,
  },
  broadcasted: {
    parsed: "Inscription broadcasted",
    info: (file_name: string) =>
      `Inscription broadcasted. Waiting for at least 1 confirmation`,
  },
  broadcasted_confirmed: {
    parsed: "Inscription broadcasted",
    info: (file_name: string) =>
      `Inscription is broadcasted and confirmed by the network, proceeding to sending it to the recipient address`,
  },
  failed_to_send: {
    parsed: "Failed to send inscription",
    info: (file_name: string) =>
      `Failed to send inscription with file name: ${file_name}. Please reach out to us to have this resolved as soon as possible`,
  },
  inscription_sent: {
    parsed: "Inscription sent",
    info: (file_name: string) =>
      `Waiting for at least 1 confirmation by the network`,
  },
  inscription_sent_confirmed: {
    parsed: "Inscription sent",
    info: (file_name: string) =>
      `The inscription has been sent and confirmed! If you have any questions or concerns, don't hesitate to reach out to us. Enjoy your inscription!`,
  },
} as const

export function parseDate(val: string) {
  return format(parseISO(val), "dd/MM/yyyy HH:mm")
}
