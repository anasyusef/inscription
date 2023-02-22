import { useStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { calculateFees } from "@/lib/utils"

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
      <div className="h-5 w-20 animate-pulse rounded-md bg-slate-300 text-xs dark:bg-slate-600 sm:text-sm"></div>
    )
  }
  return (
    <p className="text-xs text-gray-500 md:text-sm">
      ${(satsRateUsd * value).toFixed(2)}
    </p>
  )
}

function GridTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="cursor-default text-left text-xs text-gray-500 underline underline-offset-4 dark:text-gray-400 md:text-base">
      {children}
    </p>
  )
}

function GridContent({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-gray-500 dark:text-gray-400 md:text-base">
      {children}
    </p>
  )
}

export const TransactionCost = () => {
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
      <div className="grid grid-cols-3 grid-rows-2 items-center gap-x-4 gap-y-1 text-right sm:gap-y-0">
        <Tooltip>
          <TooltipTrigger onClick={handleClick}>
            <GridTitle>Network fee</GridTitle>
          </TooltipTrigger>
          <TooltipContent>
            <p>It&apos;s calculated based on the size of the file</p>
          </TooltipContent>
        </Tooltip>
        <GridContent>
          {fees.networkFees} <span className="text-xs sm:text-sm">sats</span>
        </GridContent>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={fees.networkFees}
        />

        <Tooltip>
          <TooltipTrigger onClick={handleClick}>
            <GridTitle>Service fee</GridTitle>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none">
            <p>10% + 0.00025 BTC</p>
          </TooltipContent>
        </Tooltip>

        <GridContent>
          {fees.serviceFees} <span className="text-xs sm:text-sm">sats</span>
        </GridContent>

        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={fees.serviceFees}
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-x-3 text-right">
        <p className="text-left text-xs md:text-base">Total cost</p>
        <p className="text-xs font-bold md:text-base">
          {fees.totalFees} <span className="text-xs sm:text-sm">sats</span>
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
