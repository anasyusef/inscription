import { getAddressInfo } from "bitcoin-address-validation"
import { ClassValue, clsx } from "clsx"
import { format, parseISO } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateFees = (fileSize: number, priorityFee: number) => {
  const baseNetworkFee = 250
  const baseFee = 0.00025 * 100_000_000
  const pctFee = 0.1
  const segwitFileSize = fileSize / 4
  const networkFees = (segwitFileSize + baseNetworkFee) * priorityFee
  const serviceFees = networkFees * pctFee + baseFee

  return {
    networkFees: Math.floor(networkFees),
    serviceFees: Math.floor(serviceFees),
    totalFees: Math.floor(networkFees + serviceFees),
  }
}

export const isValidTaprootAddress = (address: string) => {
  try {
    const { network, type, bech32 } = getAddressInfo(address)
    // TODO - Change back to check mainnet address
    if (network !== "mainnet" || type !== "p2tr" || !bech32) {
    // if (type !== "p2tr" || !bech32) {
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
  return `${(size / 1000).toFixed(2).toString()} kB`
}

export const STATUS = {
  payment_pending: { parsed: "Awaiting Payment", info: "" },
  payment_received_unconfirmed: {
    parsed: "Payment received",
    info: "Waiting for at least 1 confirmation",
  },
  payment_received_confirmed: {
    parsed: "Payment received",
    info: "Payment has been received and it has at least 1 confirmation. Proceeding to inscribe...",
  },
  payment_underpaid: {
    parsed: "Payment is less than expected",
    info: "Please send the amount remaining to proceed with the inscription. In case of any issues, please contact us",
  },
  payment_overpaid: {
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
} as const

export function parseDate(val: string) {
  return format(parseISO(val), "dd/MM/yyyy HH:mm")
}
