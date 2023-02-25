import { useState } from "react"
import clsx from "clsx"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { Key } from "ts-key-enum"

import { cn, parseFileSize } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PreviewAsset } from "./preview-asset"
import { Button, buttonVariants } from "./ui/button"

interface PreviewItemsCardProp {
  items: File[] | { assetUrl: string; mimeType: string; name?: string }[]
  onIdxChange: (idx: number) => void
  idx: number
  onClear?: () => void
  cardProps?: React.HTMLAttributes<HTMLDivElement>
  variant?: "small" | "medium"
}

export function PreviewItemsCard({
  items,
  onClear,
  idx,
  onIdxChange,
  cardProps,
  variant = "medium",
}: PreviewItemsCardProp) {
  // const [idx, setIdx] = useState(0)

  const handlePrevious = () => {
    if (isPreviousItem) {
      const newIdx = idx - 1
      // setIdx(newIdx)
      // if (onIdxChange) {
      onIdxChange(newIdx)
      // }
    }
  }

  const handleNext = () => {
    if (isNextItem) {
      const newIdx = idx + 1
      // setIdx(newIdx)
      // if (onIdxChange) {
      onIdxChange(newIdx)
      // }
    }
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
      onIdxChange(0)
    }
  }

  useHotkeys(Key.ArrowLeft, handlePrevious)
  useHotkeys(Key.ArrowRight, handleNext)
  const isNextItem = idx < items.length - 1
  const isPreviousItem = idx > 0
  const item = items[idx]

  const { className, ...rest } = cardProps || {}

  const buttonClassName = buttonVariants({
    className: variant === "medium" ? "w-24" : "w-12",
    size: "sm",
    variant: variant === "medium" ? "outline" : "ghost",
  })

  return (
    <div>
      <div
        className={cn(
          "flex justify-center rounded-md border border-black/5 bg-gray-50 p-4 dark:border-white/5 dark:bg-gray-900",
          className
        )}
        {...rest}
      >
        <PreviewAsset file={item} variant={variant} />
      </div>
      {onClear && (
        <div className="flex w-full justify-end">
          <Button
            type="button"
            onClick={handleClear}
            size="sm"
            className="mt-2 h-fit underline"
            variant="link"
          >
            Clear
          </Button>
        </div>
      )}
      {("name" in item || "size" in item) && (
        <div className="my-2 flex w-[284px] justify-center">
          <div className="flex flex-col justify-center space-y-0 text-center">
            <p className="text-base">{item.name}</p>
            {"size" in item && (
              <p className="text-sm">{parseFileSize(item.size)}</p>
            )}
          </div>
        </div>
      )}
      {items.length > 1 && (
        <div
          className={clsx({
            "flex items-center justify-center space-x-4": true,
            "mt-2": !("name" in item && "size" in item),
          })}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={handlePrevious}
              disabled={!isPreviousItem}
              type="button"
              className={buttonClassName}
            >
              {variant === "medium" ? "Previous" : <ArrowLeft />}
            </TooltipTrigger>
            <TooltipContent>Left arrow key</TooltipContent>
          </Tooltip>
          <p className="flex justify-center text-lg font-semibold">
            {idx + 1} of {items.length}
          </p>
          <Tooltip>
            <TooltipTrigger
              onClick={handleNext}
              disabled={!isNextItem}
              type="button"
              className={buttonClassName}
            >
              {variant === "medium" ? "Next" : <ArrowRight />}
            </TooltipTrigger>
            <TooltipContent>Right arrow key</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
