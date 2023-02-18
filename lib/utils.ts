import { getAddressInfo } from "bitcoin-address-validation"
import { ClassValue, clsx } from "clsx"
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
    // if (network !== "mainnet" || type !== "p2tr" || !bech32) {
    if (type !== "p2tr" || !bech32) {
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
  payment_pending: "Awaiting Payment",
  payment_received_unconfirmed:
    "Payment received - Waiting for at least 1 confirmation",
  payment_received_confirmed: "Payment received",
  payment_underpaid:
    "Amount received is less than expected amount, please send the amount remaining",
  payment_overpaid:
    "Amount received is greater than expected amount. We'll inscribe the asset received but please get in touch to request a refund of the difference",
  broadcasted: "Inscription broadcasted",
} as const
