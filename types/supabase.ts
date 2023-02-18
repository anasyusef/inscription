export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      order: {
        Row: {
          assigned_taproot_address: string
          created_at: string
          id: string
          network_fee: number
          payable_amount: number
          priority_fee: number
          recipient_address: string
          service_fee: number
          status: string
          tx_speed: string
          uid: string
          updated_at: string
        }
        Insert: {
          assigned_taproot_address: string
          created_at?: string
          id?: string
          network_fee: number
          payable_amount: number
          priority_fee: number
          recipient_address: string
          service_fee: number
          status?: string
          tx_speed: string
          uid: string
          updated_at?: string
        }
        Update: {
          assigned_taproot_address?: string
          created_at?: string
          id?: string
          network_fee?: number
          payable_amount?: number
          priority_fee?: number
          recipient_address?: string
          service_fee?: number
          status?: string
          tx_speed?: string
          uid?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
