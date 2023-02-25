import React, { useCallback, useState } from "react"
import Image from "next/image"
import { useStore } from "@/store"
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip"
import { File, FileText, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useHotkeys } from "react-hotkeys-hook"
import { Key } from "ts-key-enum"

import { parseFileSize } from "@/lib/utils"
import { PreviewAsset } from "./preview-asset"
import { PreviewItemsCard } from "./preview-items-card"
import { Button, buttonVariants } from "./ui/button"
import { Input } from "./ui/input"
import { TooltipContent } from "./ui/tooltip"

type Props = {}

const MAX_SIZE = 390 * 1000 // 390kB
export default function FileUpload({}: Props) {
  const store = useStore()

  const [idx, setIdx] = useState(0)

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
        {store.files.length > 0 && (
          <PreviewItemsCard
            idx={idx}
            onIdxChange={setIdx}
            variant="medium"
            items={store.files}
            onClear={() => store.setFiles([])}
          />
        )}
      </div>
    </>
  )
}
