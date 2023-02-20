export type Fees = {
  slow: number
  medium: number
  fast: number
}

export type InscriptionStatus =
  | "payment_pending"
  | "payment_received"
  | "payment_below_payable_amount"

export type PostOrder = {
  uid: string
  orderId: string
  assignedAddress: string
  recipientAddress: string
  totalFees: number
  priorityFee: number
}

export type GetOrder = {
  id: string
  network_fee: number
  service_fee: number
  payable_amount: number
  recipient_address: string
  status: string
  assigned_taproot_address: string
  priority_fee: number
  assets?: Asset[]
  created_at?: string
  inscription: Inscription[]
}

export type Inscription = {
  commit: string
  inscription: string
  reveal: string
  send_tx: string
  created_at: Date
}

export type Asset = {
  size: number
  url: string
  mimeType: string
}

export type GetOrders = {
  orders: GetOrder[]
}
