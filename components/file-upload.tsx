import React, { useCallback, useState } from "react"
import Image from "next/image"
import { useStore } from "@/store"
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip"
import { File, FileText, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useHotkeys } from "react-hotkeys-hook"
import { Key } from "ts-key-enum"

import { parseFileSize } from "@/lib/utils"
import { Button, buttonVariants } from "./ui/button"
import { Input } from "./ui/input"
import { TooltipContent } from "./ui/tooltip"

type Props = {}

const MAX_SIZE = 390 * 1000 // 390kB
export default function FileUpload({}: Props) {
  const store = useStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      store.setFiles(acceptedFiles)
      // setSelectedFiles(acceptedFiles)
      // Do something with the files
    },
    [store]
  )
  const {
    getRootProps,
    getInputProps,

    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_SIZE,
    accept: {
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "application/pgp-signature": [".asc"],
      "application/yaml": [".yaml", ".yml"],
      "audio/flac": [".flac"],
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "image/apng": [".apng"],
      "image/avif": [".avif"],
      "image/gif": [".gif"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
      "model/gltf-binary": [".glb"],
      "model/stl": [".stl"],
      "text/html;charset=utf-8": [".html"],
      "text/plain;charset=utf-8": [".txt"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
    },
  })

  return (
    <>
      {store.files.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center">
          <Input
            {...getInputProps()}
            id="inscription-files"
            className="hidden"
            type="file"
          />

          <div className="h-[250px] w-full space-y-2 sm:w-2/3">
            <div
              {...getRootProps()}
              className="flex h-full w-full cursor-pointer flex-col flex-wrap rounded-md border-2 border-dashed border-slate-200 text-sm hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            >
              <div className="flex h-full w-full flex-col items-center justify-center space-y-2 text-center">
                <Upload className="mb-2 h-8 w-8" />
                <p className="text-md font-extrabold">
                  Drop files, or click to select files
                </p>
                {/* <p className="text-sm text-gray-700 dark:text-gray-100">
                We accept files in the following formats:
              </p> */}
                {/* <p className="w-1/2">
                jpg/jpeg, png/apng, gif, pdf, asc, yaml/yml, wav, avif, svg,
                webp, glb, stl, html, txt, mp4, json, flac and webm
              </p> */}
                <p className="text-sm text-gray-700 dark:text-gray-100">
                  Max file size: <b>390 KB</b>
                </p>
              </div>
            </div>
            {fileRejections.map(({ file, errors }) =>
              errors.map((e) => (
                <p
                  id={e.code}
                  className="w-full text-left text-sm text-red-400"
                  key={e.code}
                >
                  {e.code === "file-too-large"
                    ? `File is larger than ${MAX_SIZE / 1000} kB`
                    : e.message}
                </p>
              ))
            )}
          </div>
        </div>
      )}
      <div className="flex w-full flex-col items-center justify-center">
        {store.files.length > 0 && <PreviewItems />}
      </div>
    </>
  )
}

// interface PreviewItemProps {
//   index: number
// }

function PreviewItems() {
  const files = useStore((item) => item.files)
  const setFiles = useStore((item) => item.setFiles)
  const [idx, setIdx] = useState(0)

  const handlePrevious = () => {
    if (isPreviousItem) {
      setIdx(idx - 1)
    }
  }

  const handleNext = () => {
    if (isNextItem) {
      setIdx(idx + 1)
    }
  }

  useHotkeys(Key.ArrowLeft, handlePrevious)
  useHotkeys(Key.ArrowRight, handleNext)
  const isNextItem = idx < files.length - 1
  const isPreviousItem = idx > 0
  const file = files[idx]

  return (
    <>
      <div>
        <div className="rounded-md border border-black/5 bg-gray-50 p-4 dark:border-white/5 dark:bg-gray-900">
          <PreviewImage file={file} />
        </div>
        <div className="flex w-full justify-end">
          <Button
            type="button"
            onClick={() => setFiles([])}
            size="sm"
            className="mt-2 h-fit underline"
            variant="link"
          >
            Clear
          </Button>
        </div>
        <div className="my-2 flex w-[284px] justify-center">
          <div className="flex flex-col justify-center space-y-0 text-center">
            <p className="text-base">{file.name}</p>
            <p className="text-sm">{parseFileSize(file.size)}</p>
          </div>
        </div>
        {files.length > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <Tooltip>
              <TooltipTrigger
                onClick={handlePrevious}
                disabled={!isPreviousItem}
                type="button"
                className={buttonVariants({ size: "sm", className: "w-24", variant: "outline" })}
              >
                Previous
              </TooltipTrigger>
              <TooltipContent>Left arrow key</TooltipContent>
            </Tooltip>
            <p className="flex justify-center text-lg font-semibold">
              {idx + 1} of {files.length}
            </p>
            <Tooltip>
              <TooltipTrigger
                onClick={handleNext}
                disabled={!isNextItem}
                type="button"
                className={buttonVariants({ className: "w-24", size: "sm", variant: "outline" })}
              >Next</TooltipTrigger>
              <TooltipContent>Right arrow key</TooltipContent>

            </Tooltip>
          </div>
        )}
      </div>
    </>
  )
}

function PreviewImage({ file }: { file: File }) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        alt="preview-image"
        height={250}
        width={250}
        className="h-[250px] w-[250px] "
        src={URL.createObjectURL(file)}
      />
    )
  }
  return (
    <div className="flex h-[250px] w-[250px] justify-center">
      <FileText className="m-auto h-[150px] w-[150px] text-gray-700 dark:text-gray-200" />
    </div>
  )
}
