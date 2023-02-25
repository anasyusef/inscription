import Image from "next/image"
import { FileText } from "lucide-react"

export type Fileish = File | { assetUrl: string; mimeType: string }

export function PreviewAsset({
  file,
  variant = "medium",
}: {
  file: Fileish
  variant?: "small" | "medium" | "large"
}) {
  let props: any = {}
  switch (variant) {
    case "small": {
      props.height = 150
      props.width = 150
      props.fallbackComponentClassName = "h-[100px] w-[100px]"
      props.className = "h-[150px] w-[150px]"
      break
    }
    case "medium": {
      props.height = 250
      props.width = 250
      props.fallbackComponentClassName = "h-[150px] w-[150px]"
      props.className = "h-[250px] w-[250px]"
      break
    }
    case "medium": {
      props.height = 350
      props.width = 350
      props.fallbackComponentClassName = "h-[200px] w-[200px]"
      props.className = "h-[350px] w-[350px]"
      break
    }
  }
  let type = ""
  let src = ""
  if ("assetUrl" in file) {
    src = file.assetUrl
    type = file.mimeType
  } else {
    src = URL.createObjectURL(file)
    type = file.type
  }
  if (type.startsWith("image/")) {
    return (
      <Image
        alt="preview-image"
        height={props.height}
        width={props.width}
        className={`${props.className} object-contain`}
        src={src}
      />
    )
  }

  return (
    <div className={`flex ${props.className} justify-center`}>
      <FileText
        className={`m-auto ${props.fallbackComponentClassName} text-gray-700 dark:text-gray-200`}
      />
    </div>
  )
}
