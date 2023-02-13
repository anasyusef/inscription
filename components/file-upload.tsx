import React, { useCallback, useState } from "react"
import Image from "next/image"
import { File, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

type Props = {}

const MAX_SIZE = 390 * 1000 // 390kB
export default function FileUpload({}: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles)
    // Do something with the files
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,

    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    // validator: sizeValidator,
    multiple: false,
    maxSize: MAX_SIZE,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/svg+xml": [],
      "text/html": [],
      "application/pdf": [],
    },
  })

  const handleClear = (e: any) => {
    e.stopPropagation()
    setSelectedFiles([])
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Input
        {...getInputProps()}
        id="inscription-files"
        className="hidden"
        type="file"
      />

      <div className="h-[200px] w-full space-y-2 sm:h-[300px]">
        <div
          {...getRootProps()}
          className="flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-slate-200 text-sm hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:bg-slate-800 "
        >
          {selectedFiles.length ? (
            selectedFiles.map((file) => {
              let component = null
              console.log(file.type)
              if (file.type.startsWith("image/")) {
                component = (
                  <Image
                    alt="preview-image"
                    height={200}
                    width={200}
                    src={URL.createObjectURL(file)}
                  />
                )
              } else {
                component = <File className="m-auto h-[200px] w-[100px]" />
              }
              return (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex cursor-auto flex-col items-center justify-center space-y-1"
                >
                  {component}
                  <div className="flex w-full items-center justify-between space-x-2 rounded-sm bg-slate-200 px-2 py-1 dark:bg-slate-700">
                    <div className="space-y-1">
                      <p>{file.name}</p>
                      <p>{Math.round((file.size / 1000) * 100) / 100} kB</p>
                    </div>
                    <Button onClick={handleClear} size="sm" variant="link">
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2 text-center">
              <Upload className="h-12 w-12" />

              <p className="text-lg font-extrabold">
                Drop file, or click to select file
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-100">
                We accept files in the following formats: PNG, JPEG, JPG, PDF,
                HTML, and SVG
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-100">
                Max file size: <b>390 KB</b>
              </p>
            </div>
          )}
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
  )
}
