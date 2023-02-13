import React, { ChangeEvent, useState } from "react"
import * as RadioGroup from "@radix-ui/react-radio-group"
import clsx from "clsx"

import { Fees } from "@/types/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"

type SelectedTxSpeed = "slow" | "normal" | "fast" | "custom"

export default function TransactionSpeed({
  slow,
  medium,
  fast,
}: Fees) {
  const [selectedTxSpeed, setSelectedTxSpeed] =
    useState<SelectedTxSpeed>("normal")

  const [inputFocus, setInputFocus] = useState(false)
  const estimateTxSpeed = {
    [slow]: "~1 hour",
    [medium]: "~30 minutes",
    [fast]: "~15 minutes",
  }

  const getEstimateTime = (value: number) => {
    let estimate = estimateTxSpeed[value]
    if (estimate) return estimate

    if (value < slow) {
      return ">1 hour"
    }

    if (value > slow && value < medium) {
      return estimateTxSpeed[slow]
    }

    if (value > medium && value < fast) {
      return estimateTxSpeed[medium]
    }

    if (value > fast) {
      return "<15 minutes"
    }

    return estimateTxSpeed[fast]
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (!isNaN(+value)) {
      setValue(+value)
    } else {
      setValue(0)
    }
  }

  const [value, setValue] = useState(fast)

  return (
    <>
      <div className="flex w-full flex-col space-y-3">
        <Label htmlFor="transaction-speed">Transaction fee</Label>
        <RadioGroup.Root
          id="transaction-speed"
          onValueChange={(value) =>
            setSelectedTxSpeed(value as SelectedTxSpeed)
          }
          orientation="horizontal"
          className="focus:outline-none"
          defaultValue="normal"
        >
          <div className="grid items-center justify-center gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
            <TransactionSpeedItem
              name="Slow 🐌"
              value="slow"
              satsPerVb={slow}
              timeEstimate="~1 hour"
              selected={selectedTxSpeed === "slow"}
            />
            <TransactionSpeedItem
              name="Normal 🐎"
              satsPerVb={medium}
              value="normal"
              timeEstimate="~30 minutes"
              selected={selectedTxSpeed === "normal"}
            />
            <TransactionSpeedItem
              satsPerVb={fast}
              // fiatEquivalent={12}
              name="Fast 💨"
              value="fast"
              timeEstimate="~15 minutes"
              selected={selectedTxSpeed === "fast"}
            />
            <TransactionSpeedItem
              name="Custom ⚙️"
              value="custom"
              selected={selectedTxSpeed === "custom"}
            />
          </div>
        </RadioGroup.Root>
      </div>
      <div className="w-full">
        {selectedTxSpeed === "custom" && (
          <div className="grid w-full justify-center gap-2 space-x-2  sm:space-y-0">
            <div
              className={clsx({
                "flex items-center space-x-2 rounded-md border px-2 dark:border-slate-700 dark:text-slate-50":
                  true,
                "outline-none ring-2 ring-slate-400 ring-offset-2 dark:ring-slate-400 dark:ring-offset-slate-900":
                  inputFocus,
              })}
            >
              <Input
                value={value}
                className="border-0 focus:ring-0 focus:ring-offset-0"
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                onChange={handleInputChange}
                type="text"
                min={1}
              />
              <p className="text-md text-gray-600 dark:text-gray-400">sat/vB</p>
            </div>
            <div>
              <p>
                Estimated time:{" "}
                <span className="font-semibold">{getEstimateTime(value)}</span>
              </p>
              {/* <p>
                Total cost: <span className="font-semibold">~1 hour</span>
              </p> */}
            </div>
          </div>
        )}
      </div>
      <Button>Submit</Button>
    </>
  )
}

interface TransactionSpeedProps {
  name: string
  value: string
  timeEstimate?: string
  selected: boolean
  satsPerVb?: number
}

const TransactionSpeedItem = ({
  name,
  selected,
  value,
  satsPerVb,
  timeEstimate,
}: TransactionSpeedProps) => {
  const shouldShowDetails = value !== "custom"
  return (
    <RadioGroup.Item
      className={clsx({
        "flex w-40 h-full flex-col items-center justify-between rounded-md border p-4 focus:outline-none dark:border-slate-700":
          true,
        "dark:bg-slate-700 bg-opacity-10 bg-slate-800 border-slate-300":
          selected,
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
            <div className="h-5 w-20 animate-pulse rounded-md bg-slate-600 text-sm"></div>
          ))}
      </div>
    </RadioGroup.Item>
  )
}
