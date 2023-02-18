import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import { SelectedTxSpeed } from "./types"

interface BearState {
  files: File[]
  setFiles: (v: File[]) => void
  priorityFee: number
  txSpeed: SelectedTxSpeed
  setTxSpeed: (v: SelectedTxSpeed) => void
  recipientAddress: string
  setRecipientAddress: (v: string) => void
  setPriorityFee: (v: number) => void
}

export const useStore = create<BearState>()(
  devtools(
    (set) => ({
      priorityFee: 0,
      setPriorityFee: (v) => set(() => ({ priorityFee: v })),
      txSpeed: "normal",
      setTxSpeed: (v) => set(() => ({ txSpeed: v })),
      files: [],
      setFiles: (v) => set(() => ({ files: v })),
      recipientAddress: "",
      setRecipientAddress: (v) => set(() => ({ recipientAddress: v })),
    }),
    {
      name: "main-store",
    }
  )
)

interface AuthState {
  uid: string
  generateUid: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        uid: uuidv4(),
        generateUid: () => set(() => ({ uid: uuidv4() })),
      }),
      { name: "auth-storage" }
    )
  )
)
