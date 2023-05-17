import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import { InputAsset, SelectedTxSpeed } from "./types"

interface BearState {
  files: File[]
  type: InputAsset
  setType: (val: InputAsset) => void
  text: string
  setText: (val: string) => void
  setFiles: (v: File[]) => void
  priorityFee: number
  txSpeed: SelectedTxSpeed
  setTxSpeed: (v: SelectedTxSpeed) => void
  recipientAddress: string
  setRecipientAddress: (v: string) => void
  setPriorityFee: (v: number) => void
  clear: () => void
  isInputAssetValid: () => boolean
  getInputAsset: () => File[] | string
}

export const useStore = create<BearState>()(
  devtools(
    (set, get) => ({
      priorityFee: 0,
      setText: (v) => set(() => ({ text: v })),
      text: "",
      type: "file",
      setType: (v) => set(() => ({ type: v })),
      setPriorityFee: (v) => set(() => ({ priorityFee: v })),
      txSpeed: "normal",
      setTxSpeed: (v) => set(() => ({ txSpeed: v })),
      files: [],
      setFiles: (v) => set(() => ({ files: v })),
      recipientAddress: "",
      setRecipientAddress: (v) => set(() => ({ recipientAddress: v })),
      clear: () => set(() => ({ recipientAddress: "", files: [] })),
      isInputAssetValid: () => {
        const isTextInputValid = get().type === "text" && get().text !== ""
        const isFileInputValid = get().type === "file" && get().files.length > 0
        return isFileInputValid || isTextInputValid
      },
      getInputAsset: () => (get().type === "file" ? get().files : get().text),
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
