import { useStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { HelpCircle } from "lucide-react"

import { calculateFees } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button"

function PriceData({
  isLoading,
  rate,
  value,
}: {
  isLoading: boolean
  rate: string
  value: number
}) {
  const satsRateUsd = +rate / 100_000_000
  if (isLoading) {
    return (
      <div className="h-5 w-20 animate-pulse rounded-md bg-slate-300 text-sm dark:bg-slate-600"></div>
    )
  }
  return (
    <p className="text-sm text-gray-500">${(satsRateUsd * value).toFixed(2)}</p>
  )
}

export const TxCost = () => {
  const store = useStore()
  const { data, isLoading } = useQuery(
    ["btcusdt"],
    async () =>
      axios.get("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT"),
    { cacheTime: 30 * 1_000, staleTime: 30 * 1_000 }
  )

  const handleClick = (e: any) => {
    e.preventDefault()
  }

  if (!store.files.length) return null
  const fees = calculateFees(store.files[0].size, store.priorityFee)
  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 items-center gap-x-4 gap-y-0 text-right">
        <Tooltip>
          <TooltipTrigger onClick={handleClick}>
            <p className="text-md cursor-default text-gray-500 underline underline-offset-4">
              Network fee
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>It&apos;s calculated based on the size of the file</p>
          </TooltipContent>
        </Tooltip>
        <p className="text-md text-gray-500">
          {fees.networkFees} <span className="text-sm">sats</span>
        </p>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={fees.networkFees}
        />

        <Tooltip>
          <TooltipTrigger onClick={handleClick}>
            <p className="text-md cursor-default text-gray-500 underline underline-offset-4">
              Service fee
            </p>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none">
            <p>10% + 0.00025 BTC</p>
          </TooltipContent>
        </Tooltip>

        <p className="text-md text-gray-500">
          {fees.serviceFees} <span className="text-sm">sats</span>
        </p>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={fees.serviceFees}
        />
      </div>
      <div className=" grid grid-cols-3 items-center gap-x-3 text-right">
        <p className="text-md">Total cost</p>
        <p className="text-md font-bold">
          {fees.totalFees} <span className="text-sm">sats</span>
        </p>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={fees.totalFees}
        />
      </div>
    </>
  )
}
