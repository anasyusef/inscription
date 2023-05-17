import { useStore } from "@/store"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import FileUpload from "./file-upload"

export function InputAssets() {
  const store = useStore()
  return (
    <Tabs
      value={store.type}
      onValueChange={store.setType as (v: string) => void}
      className="w-full sm:w-2/3"
    >
      <TabsList>
        <TabsTrigger value="file">File(s)</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        {/* <TabsTrigger value="sats-domain">.sats</TabsTrigger> */}
      </TabsList>
      <TabsContent className="border-0 p-0" value="file">
        <FileUpload />
      </TabsContent>
      <TabsContent className="border-0 p-0" value="text">
        <div className="flex justify-center">
          <Textarea
            value={store.text}
            maxLength={390_000}
            minLength={1}
            onChange={(e) => store.setText(e.target.value)}
            className="h-[250px] w-full justify-center"
            placeholder="Type your message here."
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
