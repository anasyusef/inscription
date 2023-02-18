import { useState } from "react"
import { useAuthStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface PaymentDialogProps {
  open: boolean
  orderId: string
  onOpenChange: (open: boolean) => void
}

export const PaymentDialog = ({
  open,
  orderId,
  onOpenChange,
}: PaymentDialogProps) => {
  const { uid } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const { data } = useQuery(
    ["order", uid, orderId],
    async () => axios.get(`/api/order?uid=${uid}&orderId=${orderId}`),
    { enabled: !!orderId }
  )

  const handleTooltipClick = (e: any) => {
    setCopied(true)
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Make payment</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <div className="space-y-2">
            <p>Pay the following amount:</p>
            <div className="flex items-center space-x-2">
              <Tooltip onOpenChange={() => setCopied(false)} delayDuration={0}>
                <TooltipTrigger
                  onPointerDown={handleTooltipClick}
                  onClick={handleTooltipClick}
                >
                  <div className="rounded-md bg-slate-100 py-1 px-3 font-semibold dark:bg-slate-800">
                    0.0023
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Click to copy"}
                </TooltipContent>
              </Tooltip>
              <p className="font-semibold">BTC</p>
            </div>
          </div>
          <p>to the following address:</p>
          <p>tb1pg6d7575xuzkmck09e0hksle0ev0y8azywfhtg8e0fj84zkjy3emqkdm26d</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
