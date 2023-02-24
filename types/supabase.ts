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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      File: {
        Row: {
          assigned_taproot_address: string
          commit_tx: string
          fees: number
          file_size: number
          id: number
          inscription_id: string
          mime_type: string
          name: string
          object_id: string
          order_id: string
          path: string | null
          recipient_address: string
          reveal_tx: string
          send_tx: string | null
          status: string
        }
        Insert: {
          assigned_taproot_address: string
          commit_tx: string
          fees: number
          file_size: number
          id?: number
          inscription_id: string
          mime_type: string
          name: string
          object_id: string
          order_id: string
          path?: string | null
          recipient_address: string
          reveal_tx: string
          send_tx?: string | null
          status?: string
        }
        Update: {
          assigned_taproot_address?: string
          commit_tx?: string
          fees?: number
          file_size?: number
          id?: number
          inscription_id?: string
          mime_type?: string
          name?: string
          object_id?: string
          order_id?: string
          path?: string | null
          recipient_address?: string
          reveal_tx?: string
          send_tx?: string | null
          status?: string
        }
      }
      Job: {
        Row: {
          created_at: string | null
          file_path: string
          id: number
          retries: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: number
          retries?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: number
          retries?: number | null
          status?: string | null
        }
      }
      Order: {
        Row: {
          created_at: string
          id: string
          network_fee: number
          payable_amount: number
          priority_fee: number
          service_fee: number
          tx_speed: string
          uid: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          network_fee: number
          payable_amount: number
          priority_fee: number
          service_fee: number
          tx_speed: string
          uid: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          network_fee?: number
          payable_amount?: number
          priority_fee?: number
          service_fee?: number
          tx_speed?: string
          uid?: string
          updated_at?: string
        }
      }
      Transaction: {
        Row: {
          amount_sats: number
          confirmations: number
          created_at: string | null
          order_id: string
          received_at: string
          tx_hash: string
        }
        Insert: {
          amount_sats: number
          confirmations: number
          created_at?: string | null
          order_id: string
          received_at: string
          tx_hash: string
        }
        Update: {
          amount_sats?: number
          confirmations?: number
          created_at?: string | null
          order_id?: string
          received_at?: string
          tx_hash?: string
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
