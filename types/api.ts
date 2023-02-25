export type Fees = {
  slow: number
  normal: number
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
  uiOrderStatusTitle: string
  uiOrderStatusSubTitle?: string
  created_at: string
  updated_at: string
  total_payable_amount: number
  files: FileRow[]
  status: string
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

export interface FileRow {
  id: string
  assigned_taproot_address: string
  commit_tx: any
  inscription_id: any
  network_fee: string
  priority_fee: number
  service_fee: string
  send_tx: string
  reveal_tx: any
  recipient_address: string
  name: string
  mime_type: string
  asset_url: string
  status: string
}

