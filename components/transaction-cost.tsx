import { useStore } from "@/store"
import { InputAsset } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { sum } from "lodash"

import { calculateFees, cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function PriceData({
  isLoading,
  rate,
  value,
  ...rest
}: {
  isLoading: boolean
  rate: string
  value: number
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const satsRateUsd = +rate / 100_000_000
  if (isLoading) {
    return (
      <div className="h-5 w-20 animate-pulse rounded-md bg-slate-300 text-xs dark:bg-slate-600 sm:text-sm"></div>
    )
  }

  const { className, ...props } = rest || {}
  return (
    <p className={cn("text-xs text-gray-500 md:text-sm", className)} {...props}>
      ${(satsRateUsd * value).toFixed(2)}
    </p>
  )
}

function GridTitle({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...props } = rest || {}
  return (
    <p
      className={cn(
        "flex cursor-default items-center text-left text-xs text-gray-500 underline underline-offset-4 dark:text-gray-400 md:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function GridContent({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...props } = rest || {}
  return (
    <p
      className={cn(
        "text-xs text-gray-500 dark:text-gray-400 md:text-base",
        className
      )}
      {...props}
    >
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

  const getFees = (type: InputAsset, data: File[] | string) => {
    let totalFees = 0
    let totalNetworkFees = 0
    let totalServiceFees = 0
    if (type === "file" && Array.isArray(data)) {
      const fileFees = data.map((file) =>
        calculateFees(file.size, store.priorityFee)
      )
      totalNetworkFees = sum(fileFees.map((item) => item.networkFees))
      totalServiceFees = sum(fileFees.map((item) => item.serviceFees))
      totalFees = sum(fileFees.map((item) => item.totalFees))
    } else {
      const textFees = calculateFees(
        store.text.length * 2,
        store.priorityFee,
      )
      totalNetworkFees = textFees.networkFees
      totalServiceFees = textFees.serviceFees
      totalFees = textFees.totalFees
    }
    return {
      totalNetworkFees,
      totalServiceFees,
      totalFees,
    }
  }

  const { totalFees, totalNetworkFees, totalServiceFees } = getFees(
    store.type,
    store.getInputAsset()
  )

  if (!store.isInputAssetValid()) return null

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 items-center gap-x-4 gap-y-1 text-right sm:gap-y-0">
        <Tooltip>
          <TooltipTrigger onClick={handleClick}>
            <GridTitle>Network fee</GridTitle>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm text-center">
            <p>
              This is the fee that the Bitcoin network takes + the sats required
              to send to inscribe an asset, which is 10,000. It&apos;s
              calculated based on the size of the file
            </p>
          </TooltipContent>
        </Tooltip>
        <GridContent>
          {totalNetworkFees} <span className="text-xs sm:text-sm">sats</span>
        </GridContent>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={totalNetworkFees}
        />

        <Tooltip
        // open={false}
        >
          <TooltipTrigger onClick={handleClick}>
            <div className="flex cursor-default items-center space-x-4">
              <GridTitle
              //  className="line-through"
              >
                Service fee{" "}
              </GridTitle>
              {/* <div
                style={{
                  background:
                    "linear-gradient(150deg, #569AFF 11.21%, #88DFAB 84.57%)",
                }}
                className="flex rounded-md py-1 px-2 text-xs font-bold text-white no-underline"
              >
                0% fee
              </div> */}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="max-w-sm text-center"
            // className="pointer-events-none"
          >
            <p>
              This is our fee to keep our services up & running, which is 10% of
              the network fees + 0.00025 BTC
            </p>
          </TooltipContent>
        </Tooltip>

        <GridContent
        //  className="line-through"
        >
          {totalServiceFees} <span className="text-xs sm:text-sm">sats</span>
        </GridContent>

        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={totalServiceFees}
          // className="line-through"
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-x-3 text-right">
        <p className="text-left text-xs md:text-base">Total cost</p>
        <p className="text-xs font-bold md:text-base">
          {totalFees} <span className="text-xs sm:text-sm">sats</span>
        </p>
        <PriceData
          isLoading={isLoading}
          rate={data?.data.price}
          value={totalFees}
        />
      </div>
    </>
  )
}
