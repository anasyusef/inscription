import { ChangeEvent, useEffect, useRef, useState } from "react"
import { usePriorityFees } from "@/hooks/usePriorityFees"
import { useStore } from "@/store"
import { SelectedTxSpeed } from "@/types"
import * as RadioGroup from "@radix-ui/react-radio-group"
import clsx from "clsx"

import { Fees } from "@/types/api"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const estimateTxSpeed = ({ slow, normal, fast }: Fees) => ({
  [slow]: "~1 hour",
  [normal]: "~30 minutes",
  [fast]: "~15 minutes",
})

function isNumeric(value: string) {
  return /^-?\d+$/.test(value)
}

const getEstimateTime = (value: number, fees: Fees) => {
  let estimate = estimateTxSpeed(fees)[value]
  const { slow, normal, fast } = fees
  if (estimate) return estimate

  if (value < slow) {
    return ">1 hour"
  }

  if (value > slow && value < normal) {
    return estimateTxSpeed(fees)[slow]
  }

  if (value > normal && value < fast) {
    return estimateTxSpeed(fees)[normal]
  }

  if (value > fast) {
    return "<15 minutes"
  }

  return (estimateTxSpeed as any)[fast]
}

export default function TransactionSpeed() {
  const store = useStore()
  const { data, isFetched, ...rest } = usePriorityFees()
  const [inputValue, setInputValue] = useState("")
  const previousValueRef = useRef(inputValue)
  const [error, setError] = useState("")
  // Workaround to only one fetch
  // const [selectedTxSpeed, setSelectedTxSpeed] =
  //   useState<SelectedTxSpeed>("normal")

  const [inputFocus, setInputFocus] = useState(false)

  const validateInput = (value: string) => {
    let error = ""
    if (!isNaN(+value) && value.indexOf(".") !== -1) {
      error = "Value cannot be a decimal"
    } else if (!isNumeric(value)) {
      error = "Value must be a number"
    } else if (isNumeric(value) && +value < 1) {
      error = "Value too low"
    } else if (isNumeric(value) && +value > 99999) {
      error = "Value too high"
    }

    return error
  }

  useEffect(() => {
    if (data?.data && store.txSpeed !== "custom") {
      store.setPriorityFee(data.data[store.txSpeed])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setInputValue(value)
    const error = validateInput(value)
    if (error) {
      setError(error)
    } else {
      store.setPriorityFee(+value)
      setError("")
    }
  }

  // const [customPriorityFee, setCustomPriorityFee] = useState(0)

  const handleValueChange = (value: SelectedTxSpeed) => {
    store.setTxSpeed(value)
    if (data) {
      if (value === "custom") {
        setInputValue(data.data.fast.toString())
        previousValueRef.current = data.data.fast.toString()
        store.setPriorityFee(data.data.fast)
      } else {
        store.setPriorityFee(data.data[value])
      }
    }
  }

  const handleInputBlur = () => {
    const error = validateInput(inputValue)

    if (error) {
      setInputValue(previousValueRef.current)
      setError("")
    } else {
      previousValueRef.current = inputValue
      store.setPriorityFee(+inputValue)
    }
    setInputFocus(false)
  }

  const label: Record<SelectedTxSpeed, string> = {
    slow: "Slow 🐌",
    normal: "Normal 🐎",
    fast: "Fast 💨",
    custom: "Custom ⚙️",
  }

  const isDisabled = !store.isInputAssetValid()

  return (
    <>
      <div className="flex w-full flex-col space-y-3">
        <div>
          <Label htmlFor="transaction-speed">Transaction fee</Label>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Choose how quickly you want your inscription to be processed. Faster
            transactions cost more. Times shown are estimates and subject to
            change based on network conditions and other factors.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="block md:hidden" asChild>
            <Button variant="outline">{label[store.txSpeed]}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex- flex w-[200px] justify-between">
            <DropdownMenuRadioGroup
              className="w-full"
              onValueChange={(val) => handleValueChange(val as SelectedTxSpeed)}
              value={store.txSpeed}
            >
              <DropdownMenuRadioItem className="justify-between" value="slow">
                <span>Slow 🐌</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ~1 hour
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="justify-between" value="normal">
                <span>Normal 🐎</span>
                <span className="text-gray-500 dark:text-gray-400">
                  ~30 mins
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="justify-between" value="fast">
                <span>Fast 💨</span>
                <span className="text-gray-500 dark:text-gray-400">
                  ~15 mins
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="custom">
                Custom ⚙️
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <RadioGroup.Root
          disabled={isDisabled}
          id="transaction-speed"
          onValueChange={handleValueChange}
          value={store.priorityFee.toString()}
          orientation="horizontal"
          className={clsx({
            "focus:outline-none": true,
            "opacity-50": isDisabled,
            hidden: true,
            "md:block": true,
          })}
          defaultValue="normal"
        >
          <div className="grid items-center justify-center gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
            <TransactionSpeedItem
              name="Slow 🐌"
              value="slow"
              satsPerVb={data?.data?.slow}
              timeEstimate="~1 hour"
              disabled={isDisabled}
              selected={store.txSpeed === "slow"}
            />
            <TransactionSpeedItem
              name="Normal 🐎"
              satsPerVb={data?.data?.normal}
              value="normal"
              timeEstimate="~30 minutes"
              disabled={isDisabled}
              selected={store.txSpeed === "normal"}
            />
            <TransactionSpeedItem
              satsPerVb={data?.data?.fast}
              name="Fast 💨"
              value="fast"
              timeEstimate="~15 minutes"
              disabled={isDisabled}
              selected={store.txSpeed === "fast"}
            />
            <TransactionSpeedItem
              name="Custom ⚙️"
              value="custom"
              disabled={isDisabled}
              selected={store.txSpeed === "custom"}
            />
          </div>
        </RadioGroup.Root>
      </div>
      <div className="w-full">
        {store.txSpeed === "custom" && (
          <div className="grid w-full justify-center gap-2 space-x-2  pt-10 sm:space-y-0">
            <div
              className={cn(
                clsx({
                  "flex items-center space-x-2 rounded-md border px-2 dark:border-slate-700 dark:text-slate-50":
                    true,
                  "outline-none ring-2 ring-slate-400 ring-offset-2 dark:ring-slate-400 dark:ring-offset-slate-900":
                    inputFocus && !error,
                  "outline-none ring-2 ring-red-500": inputFocus && !!error,
                })
              )}
            >
              <Input
                value={inputValue}
                className={"border-0 focus:ring-0 focus:ring-offset-0"}
                onFocus={() => setInputFocus(true)}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                type="text"
              />
              <p className="text-md text-gray-600 dark:text-gray-400">sat/vB</p>
            </div>
            {error && <Label className="text-red-500">{error}</Label>}
            <div>
              {isFetched && !error && data && (
                <p className="text-center text-sm md:text-base">
                  Estimated time:{" "}
                  <span className="font-semibold">
                    {getEstimateTime(+inputValue, data.data)}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

interface TransactionSpeedProps {
  name: string
  value: string
  timeEstimate?: string
  selected: boolean
  satsPerVb?: number
  disabled?: boolean
}

const TransactionSpeedItem = ({
  name,
  selected,
  value,
  satsPerVb,
  timeEstimate,
  disabled,
}: TransactionSpeedProps) => {
  const shouldShowDetails = value !== "custom"
  return (
    <RadioGroup.Item
      className={clsx({
        "flex w-40 h-full flex-col items-center justify-between rounded-md border p-4 focus:outline-none dark:border-slate-700":
          true,
        "dark:bg-slate-700 bg-opacity-10 bg-slate-800 border-slate-300":
          selected && !disabled,
      })}
      value={value}
      id="r1"
    >
      <div className="mb-2 flex h-full flex-col items-center justify-center text-center">
        <p className="font-bold">{name}</p>
        {timeEstimate && <p>{timeEstimate}</p>}
      </div>
      <div>
        {shouldShowDetails &&
          (satsPerVb ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {satsPerVb} {satsPerVb > 1 ? "sats/vB" : "sat/vB"}
            </p>
          ) : (
            <div className="h-5 w-20 animate-pulse rounded-md bg-slate-300 text-sm dark:bg-slate-600"></div>
          ))}
      </div>
    </RadioGroup.Item>
  )
}
